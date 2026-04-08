import {
  Gathering,
  GatheringParticipant,
  JammitUser,
  Review,
} from '@/database/entities';
import {
  BandSession,
  GatheringStatus,
  ParticipantStatus,
} from '@/jammit-shared/jammit.enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JammitGatheringService } from '../jammit-gathering/jammit-gathering.service';

@Injectable()
export class JammitReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(JammitUser)
    private readonly userRepo: Repository<JammitUser>,
    @InjectRepository(Gathering)
    private readonly gatheringRepo: Repository<Gathering>,
    @InjectRepository(GatheringParticipant)
    private readonly participantRepo: Repository<GatheringParticipant>,
    private readonly gatheringService: JammitGatheringService,
    private readonly dataSource: DataSource,
  ) {}

  private reviewRelations = [
    'reviewer',
    'reviewer.userBandSessions',
    'reviewee',
    'gathering',
    'gathering.createdBy',
  ] as const;

  async createReview(reviewer: JammitUser, dto: Record<string, unknown>) {
    const revieweeId = dto.revieweeId as number;
    const gatheringId = dto.gatheringId as number;
    const reviewee = await this.userRepo.findOneBy({ id: revieweeId });
    if (!reviewee) throw new BadRequestException('리뷰 대상자를 찾을 수 없습니다.');
    const gathering = await this.gatheringService.findById(gatheringId);
    if (!gathering) throw new BadRequestException('모임을 찾을 수 없습니다.');
    if (gathering.status !== GatheringStatus.COMPLETED) {
      throw new BadRequestException('완료된 모임만 리뷰를 작성할 수 있습니다.');
    }
    const rDone = await this.participantRepo.exists({
      where: {
        user: { id: reviewer.id },
        gathering: { id: gatheringId },
        status: ParticipantStatus.COMPLETED,
      },
    });
    if (!rDone) {
      throw new BadRequestException('모임에 참여 완료한 사용자만 리뷰를 작성할 수 있습니다.');
    }
    const eDone = await this.participantRepo.exists({
      where: {
        user: { id: revieweeId },
        gathering: { id: gatheringId },
        status: ParticipantStatus.COMPLETED,
      },
    });
    if (!eDone) {
      throw new BadRequestException('모임에 참여 완료한 사용자에게만 리뷰를 작성할 수 있습니다.');
    }
    const dup = await this.reviewRepo.findOne({
      where: {
        reviewer: { id: reviewer.id },
        reviewee: { id: revieweeId },
        gathering: { id: gatheringId },
      },
    });
    if (dup) {
      throw new BadRequestException('이미 이 모임에서 해당 사용자에 대한 리뷰를 작성했습니다.');
    }
    if (reviewer.id === revieweeId) {
      throw new BadRequestException('자기 자신에게 리뷰를 작성할 수 없습니다.');
    }
    const r = this.reviewRepo.create({
      reviewer,
      reviewee,
      gathering,
      content: (dto.content as string) ?? null,
      isPracticeHelped: !!dto.isPracticeHelped,
      isGoodWithMusic: !!dto.isGoodWithMusic,
      isGoodWithOthers: !!dto.isGoodWithOthers,
      isSharesPracticeResources: !!dto.isSharesPracticeResources,
      isManagingWell: !!dto.isManagingWell,
      isHelpful: !!dto.isHelpful,
      isGoodLearner: !!dto.isGoodLearner,
      isKeepingPromises: !!dto.isKeepingPromises,
    });
    await this.reviewRepo.save(r);
    const full = await this.reviewRepo.findOne({
      where: { id: r.id },
      relations: [...this.reviewRelations],
    })!;
    return this.toReviewResponse(full!);
  }

  async deleteReview(reviewerId: number, reviewId: number) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['reviewer'],
    });
    if (!review) throw new BadRequestException('리뷰를 찾을 수 없습니다.');
    if (review.reviewer.id !== reviewerId) {
      throw new BadRequestException('리뷰를 삭제할 권한이 없습니다.');
    }
    await this.reviewRepo.remove(review);
  }

  async getWritten(reviewerId: number) {
    const list = await this.reviewRepo.find({
      where: { reviewer: { id: reviewerId } },
      relations: [...this.reviewRelations],
    });
    return list.map((x) => this.toReviewResponse(x));
  }

  async getReceivedPage(revieweeId: number, page: number, pageSize: number) {
    const [content, totalElements] = await this.reviewRepo.findAndCount({
      where: { reviewee: { id: revieweeId } },
      relations: [...this.reviewRelations],
      order: { createdAt: 'DESC' },
      skip: page * pageSize,
      take: pageSize,
    });
    const totalPages = Math.ceil(totalElements / pageSize) || 1;
    return {
      content: content.map((x) => this.toReviewResponse(x)),
      page,
      size: pageSize,
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
    };
  }

  async getStatistics(revieweeId: number) {
    const reviews = await this.reviewRepo.find({ where: { reviewee: { id: revieweeId } } });
    return this.buildStats(reviews);
  }

  async getByGathering(gatheringId: number) {
    const list = await this.reviewRepo.find({
      where: { gathering: { id: gatheringId } },
      relations: [...this.reviewRelations],
    });
    return list.map((x) => this.toReviewResponse(x));
  }

  async getReviewUserPage(owner: JammitUser, userId: number, gatheringId: number) {
    const gathering = await this.gatheringService.findById(gatheringId);
    if (!gathering) throw new BadRequestException('모임을 찾을 수 없습니다.');
    if (gathering.createdBy.id !== owner.id) {
      throw new BadRequestException('모임 주최자만 접근할 수 있습니다.');
    }
    const target = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['preferredGenres', 'userBandSessions'],
    });
    if (!target) throw new BadRequestException('유저를 찾을 수 없습니다.');
    const reviews = await this.reviewRepo.find({
      where: { reviewee: { id: userId } },
      relations: [...this.reviewRelations],
    });
    const totalCreatedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: target.id } },
    });
    const completedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: target.id }, status: GatheringStatus.COMPLETED },
    });
    const userInfo = {
      ...this.toUserResponse(target),
      totalCreatedGatheringCount,
      completedGatheringCount,
    };
    return {
      userInfo,
      statistics: this.buildStats(reviews),
      reviews: reviews.map((x) => this.toReviewResponse(x)),
    };
  }

  async getUnwrittenList(me: JammitUser) {
    const sql = `
      SELECT g.id AS "gatheringId", g.gathering_name AS "gatheringName", g.gathering_thumbnail AS "gatheringThumbnail",
             p.id AS "participantId", u.id AS "userId", u.nickname AS "userNickname", u.email AS "userEmail",
             p.band_session_name AS "bandSession", p.status AS "status", p.created_at AS "createdAt", p.introduction AS "introduction"
      FROM gathering_participant gp
      JOIN gathering g ON g.id = gp.gathering_id
      JOIN gathering_participant p ON p.gathering_id = g.id
      JOIN users u ON u.id = p.user_id
      LEFT JOIN review r ON r.gathering_id = g.id AND r.reviewer_id = $1 AND r.reviewee_id = u.id
      WHERE gp.user_id = $1
        AND gp.status = 'COMPLETED'
        AND g.status = 'COMPLETED'
        AND p.status = 'COMPLETED'
        AND p.user_id <> $1
        AND r.id IS NULL
    `;
    const rows = (await this.dataSource.query(sql, [me.id])) as Record<
      string,
      unknown
    >[];
    const grouped = new Map<number, Record<string, unknown>[]>();
    for (const row of rows) {
      const gid = Number(row.gatheringId);
      if (!grouped.has(gid)) grouped.set(gid, []);
      grouped.get(gid)!.push(row);
    }
    const result: Record<string, unknown>[] = [];
    for (const [, group] of grouped) {
      const first = group[0]!;
      result.push({
        gatheringId: first.gatheringId,
        gatheringName: first.gatheringName,
        gatheringThumbnail: first.gatheringThumbnail,
        unwrittenParticipants: group.map((p) => ({
          participantId: p.participantId,
          userId: p.userId,
          userNickname: p.userNickname,
          userEmail: p.userEmail,
          bandSession: p.bandSession,
          status: p.status,
          createdAt: p.createdAt,
          introduction: p.introduction,
        })),
      });
    }
    return result;
  }

  private toUserResponse(user: JammitUser) {
    const preferredGenres = (user.preferredGenres ?? [])
      .sort((a, b) => a.priority - b.priority)
      .map((g) => g.name);
    const preferredBandSessions = (user.userBandSessions ?? [])
      .sort((a, b) => a.priority - b.priority)
      .map((s) => s.name);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferredGenres,
      preferredBandSessions,
    };
  }

  private toReviewResponse(review: Review) {
    const sessions = (review.reviewer.userBandSessions ?? [])
      .sort((a, b) => a.priority - b.priority)
      .map((s) => s.name);
    const reviewerBandSession =
      (sessions[0] as BandSession | undefined) ?? BandSession.VOCAL;
    return {
      id: review.id,
      reviewerId: review.reviewer.id,
      reviewerNickname: review.reviewer.nickname,
      reviewerBandSession,
      reviewerBandSessions: sessions,
      revieweeId: review.reviewee.id,
      revieweeNickname: review.reviewee.nickname,
      gatheringId: review.gathering.id,
      gatheringName: review.gathering.name,
      gatheringThumbnail: review.gathering.thumbnail,
      gatheringHostNickname: review.gathering.createdBy.nickname,
      content: review.content,
      practiceHelped: review.isPracticeHelped,
      goodWithMusic: review.isGoodWithMusic,
      goodWithOthers: review.isGoodWithOthers,
      sharesPracticeResources: review.isSharesPracticeResources,
      managingWell: review.isManagingWell,
      helpful: review.isHelpful,
      goodLearner: review.isGoodLearner,
      keepingPromises: review.isKeepingPromises,
      isPracticeHelped: review.isPracticeHelped,
      isGoodWithMusic: review.isGoodWithMusic,
      isGoodWithOthers: review.isGoodWithOthers,
      isSharesPracticeResources: review.isSharesPracticeResources,
      isManagingWell: review.isManagingWell,
      isHelpful: review.isHelpful,
      isGoodLearner: review.isGoodLearner,
      isKeepingPromises: review.isKeepingPromises,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private buildStats(reviews: Review[]) {
    const n = reviews.length;
    if (n === 0) {
      return {
        totalReviews: 0,
        practiceHelpedCount: 0,
        goodWithMusicCount: 0,
        goodWithOthersCount: 0,
        sharesPracticeResourcesCount: 0,
        managingWellCount: 0,
        helpfulCount: 0,
        goodLearnerCount: 0,
        keepingPromisesCount: 0,
        practiceHelpedPercentage: 0,
        goodWithMusicPercentage: 0,
        goodWithOthersPercentage: 0,
        sharesPracticeResourcesPercentage: 0,
        managingWellPercentage: 0,
        helpfulPercentage: 0,
        goodLearnerPercentage: 0,
        keepingPromisesPercentage: 0,
      };
    }
    const c = (pred: (r: Review) => boolean) => reviews.filter(pred).length;
    const pct = (x: number) => Math.round((x / n) * 1000) / 10;
    return {
      totalReviews: n,
      practiceHelpedCount: c((r) => r.isPracticeHelped),
      goodWithMusicCount: c((r) => r.isGoodWithMusic),
      goodWithOthersCount: c((r) => r.isGoodWithOthers),
      sharesPracticeResourcesCount: c((r) => r.isSharesPracticeResources),
      managingWellCount: c((r) => r.isManagingWell),
      helpfulCount: c((r) => r.isHelpful),
      goodLearnerCount: c((r) => r.isGoodLearner),
      keepingPromisesCount: c((r) => r.isKeepingPromises),
      practiceHelpedPercentage: pct(c((r) => r.isPracticeHelped)),
      goodWithMusicPercentage: pct(c((r) => r.isGoodWithMusic)),
      goodWithOthersPercentage: pct(c((r) => r.isGoodWithOthers)),
      sharesPracticeResourcesPercentage: pct(c((r) => r.isSharesPracticeResources)),
      managingWellPercentage: pct(c((r) => r.isManagingWell)),
      helpfulPercentage: pct(c((r) => r.isHelpful)),
      goodLearnerPercentage: pct(c((r) => r.isGoodLearner)),
      keepingPromisesPercentage: pct(c((r) => r.isKeepingPromises)),
    };
  }
}
