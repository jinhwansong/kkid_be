import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JammitPersistenceModule } from '@/database/jammit-persistence.module';
import { JammitUserController } from './jammit-user.controller';
import { JammitUserService } from './jammit-user.service';

@Module({
  imports: [JammitPersistenceModule, HttpModule],
  controllers: [JammitUserController],
  providers: [JammitUserService],
})
export class JammitUserModule {}
