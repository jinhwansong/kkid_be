import { Gathering, GatheringParticipant } from '@/database/entities';
import { GatheringStatus, ParticipantStatus } from '@/jammit-shared/jammit.enums';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, Interval } from '@nestjs/schedule';
import { JammitGatheringService } from './jammit-gathering.service';

@Injectable()
export class GatheringScheduler {
  private readonly log = new Logger(GatheringScheduler.name);

  constructor(
    private readonly gatheringSvc: JammitGatheringService,
    @InjectRepository(Gathering)
    private readonly gatheringRepo: Repository<Gathering>,
    @InjectRepository(GatheringParticipant)
    private readonly participantRepo: Repository<GatheringParticipant>,
  ) {}

  @Cron('0 0 * * *')
  async completeGatheringsCron() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);
    const list = await this.gatheringSvc.findConfirmedGatheringsBetweenDates(
      yesterday,
      today,
    );
    for (const g of list) {
      g.status = GatheringStatus.COMPLETED;
      await this.gatheringRepo.save(g);
      const parts = await this.participantRepo.find({
        where: { gathering: { id: g.id } },
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
    }
    this.log.log(`모임 완료 스케줄: ${list.length}건`);
  }

  @Interval(30_000)
  async cancelIncompleteInterval() {
    const list = await this.gatheringSvc.findIncompleteGatheringsAfterDeadline(
      new Date(),
    );
    for (const g of list) {
      g.status = GatheringStatus.CANCELED;
      await this.gatheringRepo.save(g);
    }
    if (list.length) {
      this.log.log(`미완료 모임 취소: ${list.length}건`);
    }
  }
}
