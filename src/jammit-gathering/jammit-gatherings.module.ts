import { Module } from '@nestjs/common';
import { JammitPersistenceModule } from '@/database/jammit-persistence.module';
import { JammitParticipationController } from '../jammit-participation/jammit-participation.controller';
import { JammitParticipationService } from '../jammit-participation/jammit-participation.service';
import { GatheringScheduler } from './gathering.scheduler';
import { JammitGatheringController } from './jammit-gathering.controller';
import { JammitGatheringService } from './jammit-gathering.service';

@Module({
  imports: [JammitPersistenceModule],
  controllers: [JammitGatheringController, JammitParticipationController],
  providers: [
    JammitGatheringService,
    JammitParticipationService,
    GatheringScheduler,
  ],
  exports: [JammitGatheringService],
})
export class JammitGatheringsModule {}
