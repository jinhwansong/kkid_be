import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { User, Video, Like } from '@/entities';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { RedisService } from '@/redis/redis.service';
import { AuthVerificationService } from '@/auth-verification/auth-verification.service';
import { MuxService } from '@/mux/mux.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, User, Like]), HttpModule],
  controllers: [VideoController],
  providers: [VideoService, RedisService, AuthVerificationService, MuxService],
  exports: [VideoService],
})
export class VideoModule {}
