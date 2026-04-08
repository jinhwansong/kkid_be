import { Module } from '@nestjs/common';
import { JammitPersistenceModule } from '@/database/jammit-persistence.module';
import { JammitGatheringsModule } from '@/jammit-gathering/jammit-gatherings.module';
import { JammitReviewController } from './jammit-review.controller';
import { JammitReviewService } from './jammit-review.service';

@Module({
  imports: [JammitPersistenceModule, JammitGatheringsModule],
  controllers: [JammitReviewController],
  providers: [JammitReviewService],
})
export class JammitReviewModule {}
