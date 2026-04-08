import { JammitUser } from '@/database/entities';
import { Like, Video } from '@/database/entities';
import { MuxService } from '@/mux/mux.service';
import { RedisModule } from '@/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, JammitUser, Like]),
    HttpModule,
    RedisModule,
  ],
  controllers: [VideoController],
  providers: [VideoService, MuxService],
  exports: [VideoService],
})
export class VideoModule {}
