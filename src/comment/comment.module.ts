import { Comment, Video } from '@/database/entities';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  providers: [CommentService],
  imports: [TypeOrmModule.forFeature([Video, Comment]), HttpModule],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
