import {
  Gathering,
  GatheringGenre,
  GatheringParticipant,
  GatheringSession,
  JammitUser,
} from '@/database/entities';
import {
  BandSession,
  GatheringStatus,
  Genre,
  ParticipantStatus,
} from '@/jammit-shared/jammit.enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

function parseSort(
  sort?: string | string[],
): { field: string; order: 'ASC' | 'DESC' }[] {
  const raw =
    sort == null
      ? ['recruitDeadline,asc']
      : Array.isArray(sort)
        ? sort
        : [sort];
  return raw.map((s) => {
    const [prop, dir] = s.split(',');
    return {
      field: prop.trim(),
      order: dir?.trim().toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    };
  });
}

@Injectable()
export class JammitGatheringService {
  constructor(
    @InjectRepository(Gathering)
    private readonly gatheringRepo: Repository<Gathering>,
    @InjectRepository(GatheringParticipant)
    private readonly participantRepo: Repository<GatheringParticipant>,
  ) {}

  async findGatherings(
    genres?: Genre[],
    sessions?: BandSession[],
    page = 0,
    size = 20,
    sort?: string | string[],
  ) {
    const qb = this.gatheringRepo
      .createQueryBuilder('g')
      .distinct(true)
      .leftJoinAndSelect('g.gatheringSessions', 's')
      .leftJoinAndSelect('g.genreRows', 'gr')
      .leftJoinAndSelect('g.createdBy', 'creator')
      .where('g.status = :st', { st: GatheringStatus.RECRUITING });
    if (genres?.length) {
      qb.andWhere('gr.genreName IN (:...genres)', { genres });
    }
    if (sessions?.length) {
      qb.andWhere('s.name IN (:...sessions)', { sessions });
    }
    const orders = parseSort(sort);
    let applied = false;
    for (const o of orders) {
      if (o.field === 'viewCount') {
        qb.addOrderBy('g.viewCount', o.order);
        applied = true;
      } else if (o.field === 'recruitDeadline') {
        qb.addOrderBy('g.recruitDeadline', o.order);
        applied = true;
      }
    }
    if (!applied) qb.addOrderBy('g.recruitDeadline', 'ASC');

    const countQb = qb.clone();
    const total = await countQb.getCount();
    qb.skip(page * size).take(size);
    const list = await qb.getMany();

    return {
      gatherings: list.map((g) => this.toSummary(g)),
      currentPage: page,
      totalPage: Math.max(1, Math.ceil(total / size)),
      totalElements: total,
    };
  }

  async createGathering(
    user: JammitUser,
    dto: {
      name: string;
      thumbnail?: string;
      place: string;
      description: string;
      gatheringDateTime: string;
      recruitDateTime: string;
      genres: Genre[];
      gatheringSessions: { bandSession: BandSession; recruitCount: number }[];
    },
  ) {
    if (!dto.gatheringSessions?.length) {
      throw new BadRequestException('모임에는 최소 하나의 세션이 필요합니다.');
    }
    const g = this.gatheringRepo.create({
      name: dto.name,
      thumbnail: dto.thumbnail ?? null,
      place: dto.place,
      description: dto.description,
      gatheringDateTime: new Date(dto.gatheringDateTime),
      recruitDeadline: new Date(dto.recruitDateTime),
      status: GatheringStatus.RECRUITING,
      viewCount: 0,
      createdBy: user,
    });
    g.genreRows = [...new Set(dto.genres ?? [])].map((genreName) => {
      const row = new GatheringGenre();
      row.genreName = genreName;
      row.gathering = g;
      return row;
    });
    g.gatheringSessions = dto.gatheringSessions.map((se) => {
      const s = new GatheringSession();
      s.name = se.bandSession;
      s.recruitCount = se.recruitCount;
      s.currentCount = 0;
      s.gathering = g;
      return s;
    });
    const saved = await this.gatheringRepo.save(g);
    const hostSession = saved.gatheringSessions[0].name;
    const host = this.participantRepo.create({
      user,
      gathering: saved,
      name: hostSession,
      status: ParticipantStatus.COMPLETED,
      introduction: null,
    });
    await this.participantRepo.save(host);
    const reloaded = await this.gatheringRepo.findOne({
      where: { id: saved.id },
      relations: ['gatheringSessions', 'genreRows', 'createdBy'],
    })!;
    return {
      ...this.toDetail(reloaded!),
      message: '모임이 생성되었습니다.',
    };
  }

  async getDetail(id: number) {
    const g = await this.gatheringRepo.findOne({
      where: { id },
      relations: ['gatheringSessions', 'genreRows', 'createdBy'],
    });
    if (!g) throw new BadRequestException('모임이 존재하지 않습니다.');
    return this.toDetail(g);
  }

  async updateGathering(
    id: number,
    user: JammitUser,
    dto: Record<string, unknown>,
  ) {
    const g = await this.gatheringRepo.findOne({
      where: { id },
      relations: ['gatheringSessions', 'genreRows', 'createdBy'],
    });
    if (!g) throw new BadRequestException('모임을 찾을 수 없습니다.');
    if (g.createdBy.id !== user.id) {
      throw new BadRequestException('수정 권한이 없습니다.');
    }
    if (dto.name != null) g.name = dto.name as string;
    if (dto.place != null) g.place = dto.place as string;
    if (dto.description != null) g.description = dto.description as string;
    if (dto.thumbnail != null) g.thumbnail = dto.thumbnail as string;
    if (dto.gatheringDateTime != null) {
      g.gatheringDateTime = new Date(dto.gatheringDateTime as string);
    }
    if (dto.recruitDeadline != null) {
      g.recruitDeadline = new Date(dto.recruitDeadline as string);
    }
    if (dto.genres != null) {
      await this.gatheringRepo.manager.delete(GatheringGenre, {
        gathering: { id: g.id },
      });
      g.genreRows = ((dto.genres as Genre[]) ?? []).map((genreName) => {
        const row = new GatheringGenre();
        row.genreName = genreName;
        row.gathering = g;
        return row;
      });
    }
    const sessions = dto.gatheringSessions as
      | { bandSession: BandSession; recruitCount: number }[]
      | undefined;
    if (sessions?.length) {
      await this.gatheringRepo.manager.delete(GatheringSession, {
        gathering: { id: g.id },
      });
      g.gatheringSessions = sessions.map((se) => {
        const s = new GatheringSession();
        s.name = se.bandSession;
        s.recruitCount = se.recruitCount;
        s.currentCount = 0;
        s.gathering = g;
        return s;
      });
    }
    await this.gatheringRepo.save(g);
    const re = await this.gatheringRepo.findOne({
      where: { id: g.id },
      relations: ['gatheringSessions', 'genreRows', 'createdBy'],
    })!;
    return this.toDetail(re!);
  }

  async cancelGathering(id: number, user: JammitUser) {
    const g = await this.gatheringRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!g) throw new BadRequestException('모임을 찾을 수 없습니다.');
    if (g.createdBy.id !== user.id) {
      throw new BadRequestException('취소 권한이 없습니다.');
    }
    g.status = GatheringStatus.CANCELED;
    await this.gatheringRepo.save(g);
  }

  async getMyCreated(user: JammitUser, includeCanceled: boolean, page: number, size: number) {
    const qb = this.gatheringRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.gatheringSessions', 's')
      .leftJoinAndSelect('g.genreRows', 'gr')
      .leftJoinAndSelect('g.createdBy', 'creator')
      .where('creator.id = :uid', { uid: user.id });
    if (!includeCanceled) {
      qb.andWhere('g.status != :canceled', { canceled: GatheringStatus.CANCELED });
    }
    qb.orderBy('g.createdAt', 'DESC');
    const total = await qb.getCount();
    qb.skip(page * size).take(size);
    const list = await qb.getMany();
    return {
      gatherings: list.map((x) => this.toSummary(x)),
      currentPage: page,
      totalPage: Math.ceil(total / size) || 1,
      totalElements: total,
    };
  }

  /** 스케줄러·참가 서비스용 */
  async findByIdWithSessions(id: number) {
    return this.gatheringRepo.findOne({
      where: { id },
      relations: ['gatheringSessions', 'genreRows', 'createdBy', 'participants'],
    });
  }

  async findById(id: number, extraRelations: string[] = []) {
    return this.gatheringRepo.findOne({
      where: { id },
      relations: ['createdBy', ...extraRelations],
    });
  }

  countByCreatedBy(userId: number) {
    return this.gatheringRepo.count({ where: { createdBy: { id: userId } } });
  }

  countCompletedByCreator(userId: number) {
    return this.gatheringRepo.count({
      where: { createdBy: { id: userId }, status: GatheringStatus.COMPLETED },
    });
  }

  async findConfirmedGatheringsBetweenDates(start: Date, end: Date) {
    return this.gatheringRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.participants', 'p')
      .where('g.status = :st', { st: GatheringStatus.CONFIRMED })
      .andWhere('g.gatheringDateTime >= :start', { start })
      .andWhere('g.gatheringDateTime < :end', { end })
      .getMany();
  }

  async findIncompleteGatheringsAfterDeadline(now: Date) {
    return this.gatheringRepo
      .createQueryBuilder('g')
      .innerJoin('g.gatheringSessions', 's')
      .where('g.status = :st', { st: GatheringStatus.RECRUITING })
      .andWhere('g.recruitDeadline < :now', { now })
      .andWhere('s.currentCount < s.recruitCount')
      .getMany();
  }

  private toSummary(g: Gathering) {
    const sessions = dedupeSessions(g.gatheringSessions ?? []);
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
      creator: {
        id: g.createdBy.id,
        nickname: g.createdBy.nickname,
        profileImagePath: g.createdBy.profileImagePath ?? '',
      },
      sessions: sessions.map((s) => ({
        bandSession: s.name,
        recruitCount: s.recruitCount,
        currentCount: s.currentCount,
      })),
    };
  }

  private toDetail(g: Gathering) {
    const base = this.toSummary(g);
    return {
      ...base,
      description: g.description,
      sessions: base.sessions,
    };
  }
}

function dedupeSessions(sessions: GatheringSession[]): GatheringSession[] {
  const m = new Map<number, GatheringSession>();
  for (const s of sessions) {
    m.set(s.id, s);
  }
  return [...m.values()];
}
