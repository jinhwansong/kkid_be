import {
  Gathering,
  GatheringParticipant,
  GatheringSession,
  JammitUser,
} from '@/database/entities';
import {
  BandSession,
  GatheringStatus,
  ParticipantStatus,
} from '@/jammit-shared/jammit.enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { JammitGatheringService } from '../jammit-gathering/jammit-gathering.service';

@Injectable()
export class JammitParticipationService {
  constructor(
    @InjectRepository(GatheringParticipant)
    private readonly participantRepo: Repository<GatheringParticipant>,
    private readonly gatheringService: JammitGatheringService,
  ) {}

  async participate(
    gatheringId: number,
    user: JammitUser,
    bandSession: BandSession,
    introduction?: string,
  ) {
    const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
    if (!gathering) throw new BadRequestException('존재하지 않는 모임입니다.');
    if (gathering.status !== GatheringStatus.RECRUITING) {
      return this.fail('참가 신청이 불가능한 모임 상태입니다.');
    }
    const dup = await this.participantRepo.count({
      where: {
        user: { id: user.id },
        gathering: { id: gatheringId },
        name: bandSession,
        status: Not(ParticipantStatus.CANCELED),
      },
    });
    if (dup > 0) {
      return this.fail('이미 해당 파트로 신청한 이력이 있습니다.');
    }
    const session = gathering.gatheringSessions?.find((s) => s.name === bandSession);
    if (!session) throw new BadRequestException('모집 중인 세션이 아닙니다.');
    const approvedCount = await this.participantRepo.count({
      where: {
        gathering: { id: gatheringId },
        name: bandSession,
        status: ParticipantStatus.APPROVED,
      },
    });
    if (approvedCount >= session.recruitCount) {
      return this.fail('해당 세션의 모집 인원이 이미 마감되었습니다.');
    }
    const p = this.participantRepo.create({
      user,
      gathering,
      name: bandSession,
      status: ParticipantStatus.PENDING,
      introduction: introduction ?? null,
    });
    await this.participantRepo.save(p);
    return this.waiting(gatheringId, user.id, bandSession);
  }

  async cancelParticipation(gatheringId: number, participantId: number, user: JammitUser) {
    const participant = await this.participantRepo.findOne({
      where: { id: participantId },
      relations: ['user', 'gathering', 'gathering.gatheringSessions'],
    });
    if (!participant) throw new BadRequestException('해당 참가 신청이 없습니다.');
    if (participant.user.id !== user.id) {
      throw new BadRequestException('본인의 참가 신청만 취소할 수 있습니다.');
    }
    if (participant.status === ParticipantStatus.CANCELED) {
      return this.fail('이미 취소된 참가 신청입니다.');
    }
    if (participant.status === ParticipantStatus.COMPLETED) {
      return this.fail('이미 참여 완료된 모임은 취소할 수 없습니다.');
    }
    const wasApproved = participant.status === ParticipantStatus.APPROVED;
    participant.status = ParticipantStatus.CANCELED;
    if (wasApproved) {
      const g = participant.gathering;
      const s = g.gatheringSessions?.find((x) => x.name === participant.name);
      if (s && s.currentCount > 0) s.currentCount -= 1;
      await this.participantRepo.manager.save(GatheringSession, s!);
    }
    await this.participantRepo.save(participant);
    return this.canceled(gatheringId, user.id, participant.name);
  }

  async approveParticipation(gatheringId: number, participantId: number, owner: JammitUser) {
    const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
    if (!gathering) throw new BadRequestException('존재하지 않은 모임입니다.');
    if (gathering.createdBy.id !== owner.id) {
      throw new BadRequestException('승인 권한이 없습니다.');
    }
    const participant = await this.participantRepo.findOne({
      where: { id: participantId },
      relations: ['user', 'gathering'],
    });
    if (!participant) throw new BadRequestException('해당 참가 신청이 없습니다.');
    if (participant.status === ParticipantStatus.APPROVED) {
      return this.fail('이미 승인된 참가자 입니다.');
    }
    if (participant.status === ParticipantStatus.CANCELED) {
      return this.fail('이미 취소된 참가자 입니다.');
    }
    if (participant.status === ParticipantStatus.REJECTED) {
      return this.fail('이미 거절된 참가자 입니다.');
    }
    const targetSession = gathering.gatheringSessions?.find(
      (s) => s.name === participant.name,
    );
    if (!targetSession) throw new BadRequestException('밴드 세션 정보를 찾을 수 없습니다.');
    const approvedCount = await this.participantRepo.count({
      where: {
        gathering: { id: gatheringId },
        name: participant.name,
        status: ParticipantStatus.APPROVED,
      },
    });
    if (approvedCount >= targetSession.recruitCount) {
      return this.fail('해당 세션의 모집 인원이 마감되었습니다.');
    }
    participant.status = ParticipantStatus.APPROVED;
    targetSession.currentCount += 1;
    await this.participantRepo.manager.save(GatheringSession, targetSession);
    await this.participantRepo.save(participant);
    const allFilled = gathering.gatheringSessions!.every(
      (s) => s.currentCount >= s.recruitCount,
    );
    if (allFilled) {
      gathering.status = GatheringStatus.CONFIRMED;
      await this.participantRepo.manager.save(Gathering, gathering);
    }
    return this.approved(gatheringId, owner.id, participant.name);
  }

  async rejectParticipation(gatheringId: number, participantId: number, owner: JammitUser) {
    const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
    if (!gathering) throw new BadRequestException('존재하지 않은 모임입니다.');
    if (gathering.createdBy.id !== owner.id) {
      throw new BadRequestException('모임 주최자만 처리할 수 있습니다.');
    }
    const participant = await this.participantRepo.findOne({
      where: { id: participantId },
      relations: ['user'],
    });
    if (!participant) throw new BadRequestException('해당 참가 신청이 없습니다.');
    if (participant.status === ParticipantStatus.APPROVED) {
      return this.fail('이미 승인된 신청입니다.');
    }
    if (participant.status === ParticipantStatus.CANCELED) {
      return this.fail('이미 취소된 신청입니다.');
    }
    if (participant.status === ParticipantStatus.REJECTED) {
      return this.fail('이미 거절된 신청입니다.');
    }
    participant.status = ParticipantStatus.REJECTED;
    await this.participantRepo.save(participant);
    return this.rejected(gatheringId, participant.user.id, participant.name);
  }

  async findParticipants(gatheringId: number) {
    const list = await this.participantRepo.find({
      where: { gathering: { id: gatheringId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
    if (!list.length) {
      return { participants: [], total: 0 };
    }
    return {
      participants: list.map((p) => ({
        participantId: p.id,
        userId: p.user.id,
        userEmail: p.user.email,
        userNickname: p.user.nickname,
        userProfileImagePath: p.user.profileImagePath,
        bandSession: p.name,
        status: p.status,
        createdAt: p.createdAt,
        introduction: p.introduction,
      })),
      total: list.length,
    };
  }

  async getMyParticipations(
    user: JammitUser,
    page: number,
    size: number,
    includeCanceled = false,
  ) {
    const qb = this.participantRepo
      .createQueryBuilder('gp')
      .leftJoinAndSelect('gp.gathering', 'g')
      .leftJoinAndSelect('g.gatheringSessions', 's')
      .leftJoinAndSelect('g.genreRows', 'gr')
      .leftJoinAndSelect('g.createdBy', 'creator')
      .where('gp.user.id = :uid', { uid: user.id });
    if (!includeCanceled) {
      qb.andWhere('gp.status != :canceled', { canceled: ParticipantStatus.CANCELED });
    }
    qb.orderBy('gp.createdAt', 'DESC');
    const total = await qb.getCount();
    qb.skip(page * size).take(size);
    const rows = await qb.getMany();
    const gatherings = new Map<number, Gathering>();
    for (const p of rows) {
      gatherings.set(p.gathering.id, p.gathering);
    }
    const summaries = [...gatherings.values()].map((g) => this.gatheringToSummary(g));
    return {
      gatherings: summaries,
      currentPage: page,
      totalPage: Math.ceil(total / size) || 1,
      totalElements: total,
    };
  }

  async getMyCompletedGatherings(user: JammitUser) {
    const list = await this.participantRepo.find({
      where: {
        user: { id: user.id },
        status: ParticipantStatus.COMPLETED,
      },
      relations: ['gathering', 'gathering.gatheringSessions', 'gathering.createdBy'],
    });
    const out: Record<string, unknown>[] = [];
    for (const p of list) {
      const g = p.gathering;
      if (g.status !== GatheringStatus.COMPLETED) continue;
      const sessions = g.gatheringSessions ?? [];
      const totalRecruit = sessions.reduce((a, s) => a + s.recruitCount, 0);
      const totalCurrent = sessions.reduce((a, s) => a + s.currentCount, 0);
      out.push({
        id: g.id,
        name: g.name,
        thumbnail: g.thumbnail,
        gatheringDateTime: g.gatheringDateTime,
        place: g.place,
        totalRecruit,
        totalCurrent,
        status: g.status,
        hostNickname: g.createdBy?.nickname ?? '',
      });
    }
    return out;
  }

  async completeGathering(gatheringId: number, owner: JammitUser) {
    const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
    if (!gathering) throw new BadRequestException('존재하지 않은 모임입니다.');
    if (gathering.createdBy.id !== owner.id) {
      throw new BadRequestException('모임 주최자만 완료 처리할 수 있습니다.');
    }
    if (gathering.status !== GatheringStatus.CONFIRMED) {
      throw new BadRequestException('멤버 모집이 완료된 모임만 완료 처리할 수 있습니다.');
    }
    gathering.status = GatheringStatus.COMPLETED;
    const parts = await this.participantRepo.find({
      where: { gathering: { id: gatheringId } },
    });
    for (const p of parts) {
      if (
        p.status === ParticipantStatus.APPROVED ||
        p.status === ParticipantStatus.COMPLETED
      ) {
        p.status = ParticipantStatus.COMPLETED;
        await this.participantRepo.save(p);
      }
    }
    await this.participantRepo.manager.save(Gathering, gathering);
  }

  private gatheringToSummary(g: Gathering) {
    const sessions = [...new Map((g.gatheringSessions ?? []).map((s) => [s.id, s])).values()];
    const genres = new Set((g.genreRows ?? []).map((r) => r.genreName));
    return {
      id: g.id,
      name: g.name,
      place: g.place,
      thumbnail: g.thumbnail,
      gatheringDateTime: g.gatheringDateTime,
      totalRecruit: sessions.reduce((a, s) => a + s.recruitCount, 0),
      totalCurrent: sessions.reduce((a, s) => a + s.currentCount, 0),
      viewCount: g.viewCount,
      recruitDeadline: g.recruitDeadline,
      status: g.status,
      genres: [...genres],
      creator: { id: g.createdBy.id, nickname: g.createdBy.nickname },
      sessions: sessions.map((s) => ({
        bandSession: s.name,
        recruitCount: s.recruitCount,
        currentCount: s.currentCount,
      })),
    };
  }

  private waiting(gatheringId: number, userId: number, bandSession: BandSession) {
    return {
      gatheringId,
      userId,
      bandSession,
      status: ParticipantStatus.PENDING,
      message: '참여 신청이 완료되었습니다. 승인 대기 중입니다.',
    };
  }
  private approved(gatheringId: number, userId: number, bandSession: BandSession) {
    return {
      gatheringId,
      userId,
      bandSession,
      status: ParticipantStatus.APPROVED,
      message: '참여가 승인되었습니다.',
    };
  }
  private fail(message: string) {
    return { status: null, message };
  }
  private canceled(gatheringId: number, userId: number, bandSession: BandSession) {
    return {
      gatheringId,
      userId,
      bandSession,
      status: ParticipantStatus.CANCELED,
      message: '참여가 취소되었습니다.',
    };
  }
  private rejected(gatheringId: number, userId: number, bandSession: BandSession) {
    return {
      gatheringId,
      userId,
      bandSession,
      status: ParticipantStatus.REJECTED,
      message: '참여 요청이 거절되었습니다.',
    };
  }
}
