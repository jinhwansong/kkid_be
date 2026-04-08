import { Comment, Video } from '@/database/entities';
import { JammitUser } from '@/database/entities';
import { CreateUserDto } from '@/video/dto/user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async getComment(videoId: string, page: number = 1, take: number = 10) {
    try {
      const currentPage = Math.max(1, page);
      const pageSize = Math.max(1, Math.min(100, take));
      const skip = (currentPage - 1) * pageSize;
      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.videoId = :videoId', { videoId })
        .orderBy('comment.createdAt', 'DESC');
      const [results, totalCount] = await queryBuilder
        .skip(skip)
        .take(pageSize)
        .getManyAndCount();

      const data = results.map((comment) => ({
        id: comment.id,
        content: comment.content,
        nickname: comment.user?.nickname || comment.user?.username || '알 수 없음',
        profileImagePath: comment.user?.profileImagePath || null,
        createdAt: comment.createdAt,
        userId: comment.user.id,
      }));

      const totalPage = Math.ceil(totalCount / pageSize);

      return {
        totalCount,
        totalPage,
        page,
        data,
        message: '영상에 달린 댓글 리스트를 조회했습니다.',
      };
    } catch (error) {
      console.error('댓글 리스트 조회 오류:', error);
      throw new BadRequestException(
        '영상에 달린 댓글 리스트를 불러오는 중 오류가 발생했습니다.',
      );
    }
  }

  async createComment(body: CreateCommentDto, info: CreateUserDto) {
    try {
      const video = await this.videoRepository.findOneByOrFail({
        id: body.videoId,
      });
      const comment = this.commentRepository.create({
        content: body.content,
        user: { id: info.id } as JammitUser,
        video,
      });
      const saved = await this.commentRepository.save(comment);
      return {
        id: saved.id,
        content: saved.content,
        createdAt: saved.createdAt,
        nickname: info.nickname,
        profileImagePath: info.profileImagePath || null,
      };
    } catch (error) {
      console.error('댓글 쓰기 오류:', error);
      throw new BadRequestException('댓글 쓰기 중 오류가 발생했습니다.');
    }
  }
}
