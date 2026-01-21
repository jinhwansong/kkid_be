import { Comment, Video } from '@/entities';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/video/dto/user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository:Repository<Comment>,
        @InjectRepository(Video)
        private readonly videoRepository:Repository<Video>,
        private readonly userService: UserService, 
    ){}
    async getComment (
        videoId:string,
        page: number = 1,
        take: number = 10,
    ) {
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
            
            const data = results.map(comment => ({
                id: comment.id,
                content: comment.content,
                nickname: comment.user?.nickname || '알 수 없음',
                profileImagePath: comment.user?.profileImagePath || null,
                createdAt: comment.createdAt,
                userId:comment.user.userId
            }));

            // 페이지네이션 정보 계산
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
            throw new BadRequestException('영상에 달린 댓글 리스트를 불러오는 중 오류가 발생했습니다.');
        }
    }
    async createComment (body: CreateCommentDto,info: CreateUserDto) {
        try {
            const user = await this.userService.findOrCreateUser(info);
            const video = await this.videoRepository.findOneByOrFail({id:body.videoId})
            const comment = this.commentRepository.create({
                content:body.content,
                user,
                video
            })
             const saved = await this.commentRepository.save(comment);
             return {
                id:saved.id,
                content:saved.content,
                createdAt: saved.createdAt,
                nickname: user.nickname,
                profileImagePath: user.profileImagePath,
             }
        } catch (error) {
            console.error('댓글 쓰기 오류:', error);
            throw new BadRequestException('댓글 쓰기 중 오류가 발생했습니다.');
        }
    }
}
