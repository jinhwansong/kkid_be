import { AuthVerificationService } from '@/auth-verification/auth-verification.service';
import { Comment, Video } from '@/entities';
import { UserModule } from '@/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  providers: [CommentService,AuthVerificationService],
  imports: [TypeOrmModule.forFeature([Video, Comment]), UserModule, HttpModule],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
