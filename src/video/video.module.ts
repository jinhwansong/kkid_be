import { AuthVerificationService } from '@/auth-verification/auth-verification.service';
import { Like, User, Video } from '@/entities';
import { MuxService } from '@/mux/mux.service';
import { RedisService } from '@/redis/redis.service';
import { UserModule } from '@/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, User, Like]), HttpModule,UserModule],
  controllers: [VideoController],
  providers: [VideoService, RedisService, AuthVerificationService, MuxService],
  exports: [VideoService],
})
export class VideoModule {}
