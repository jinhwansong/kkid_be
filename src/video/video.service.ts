import { Like, User, Video } from '@/entities';
import { RedisService } from '@/redis/redis.service';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterMuxVideoDto } from './dto/mux.dto';
import { CreateUserDto } from './dto/video.dto';


@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly redisService: RedisService,
  ) {}
  // 웹훅
  async muxWebHook(payload: any) {
    if (payload.type === 'video.asset.ready') {
      const asset = payload.data;
      const playbackId = asset.playback_ids?.[0]?.id;
      const uploadId = asset.upload_id;
      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const playbackUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      const video = await this.videoRepository.findOne({
        where: { uploadId },
      });
      if (video) {
        video.playbackId = playbackId;
        video.thumbnailUrl = thumbnailUrl;
        video.videoUrl = playbackUrl;
        await this.videoRepository.save(video);
      }
    }
    return { received: true };
  }
  // 사용자가 업로드 후 등록 요청을 보냄
  async registerMuxVideo(info: CreateUserDto, body: RegisterMuxVideoDto) {
    try {
      const user = await this.findOrCreateUserByInfo(info);
      // db에 저장
      const video = this.videoRepository.create({
        title: body.title,
        description: body.description,
        user,
        uploadId: body.uploadId,
      });
      await this.videoRepository.save(video);
      return {
        message: '영상 등록 완료',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '영상 등록 중 오류가 발생했습니다.',
      );

    }
  }
  // 전체 영상 목록
  async getVideos(
    take: number,
    lastCreatedAt?: Date,
    order: 'latest' | 'popular' = 'latest',
  ) {
    try {
      const query = this.videoRepository
        .createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .leftJoinAndSelect('video.comment', 'comment')
        .leftJoinAndSelect('video.like', 'like')
        .loadRelationCountAndMap('video.likeCount', 'video.like')
        .loadRelationCountAndMap('video.commentCount', 'video.comment')
        .take(take)
        .orderBy(
          order === 'popular' ? 'video.viewCount' : 'video.createdAt',
          'DESC',
        );
      if (lastCreatedAt && order === 'latest') {
        query.where('video.createdAt < :lastCreatedAt', { lastCreatedAt });
      }
      const videos = await query.getMany();
      return {
        nextCursor:
          videos.length > 0 ? videos[videos.length - 1].createdAt : null,
        data: videos.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          videoUrl: item.videoUrl,
          thumbnailUrl: item.thumbnailUrl,
          viewCount: item.viewCount,
          updatedAt: item.updatedAt,
          likeCount: (item as any).likeCount ?? item.like?.length ?? 0,
          commentCount: (item as any).commentCount ?? item.comment?.length ?? 0,
          username: item.user.username,
        })),
      };
    } catch (error) {
      console.error('getVideos Error:', error);
      throw new BadRequestException(
        '영상 목록을 불러오는 중 오류가 발생했습니다.',
      );

    }
  }
  // 내가 올린 영상목록
  async getMyVideos(
    info: CreateUserDto,
    take: number,
    skip: number,
    order: 'latest' | 'popular',
  ) {
    try {
      const user = await this.findOrCreateUserByInfo(info);
      if (!user) {
        return { total: 0, data: [] };
      }
      const query = this.videoRepository
        .createQueryBuilder('video')
        .where('video.userId = :userId', { userId: user.id })
        .leftJoinAndSelect('video.comment', 'comment')
        .leftJoinAndSelect('video.like', 'like')
        .leftJoinAndSelect('video.user', 'user')
        .loadRelationCountAndMap('video.likeCount', 'video.like')
        .loadRelationCountAndMap('video.commentCount', 'video.comment')
        .orderBy(
          order === 'popular' ? 'video.viewCount' : 'video.createdAt',
          'DESC',
        )
        .skip(skip)
        .take(take);
      const [videos, total] = await query.getManyAndCount();
      return {
        total,
        data: videos.map((v) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl,
          viewCount: v.viewCount,
          updatedAt: v.updatedAt,
          likeCount: (v as any).likeCount ?? v.like?.length ?? 0,
          commentCount: (v as any).commentCount ?? v.comment?.length ?? 0,
          username: v.user.username,
        })),
      };
    } catch (error) {
      throw new BadRequestException(
        '영상 목록을 불러오는 중 오류가 발생했습니다.',
      );
    }
  }
  // 뷰 카운트
  async viewCountVideos(videoId: string, info?: CreateUserDto, ip?: string) {
    try {
      let userIdForRedis: string;
      if (info.email) {
        // 영상을 본사람들도 댓글 좋아요 쓸수 잇어야하니... 유저 정보에 들어가게 한다.
        const user = await this.findOrCreateUserByInfo(info);
        userIdForRedis = user.id;
      } else if (ip) {
        // 비회원 도 카운트 늘려야되용....
        userIdForRedis = `guest:${ip}`;
      } else {
        throw new BadRequestException('유저 식별이 불가능합니다.');
      }

      const key = `view:${userIdForRedis}:${videoId}`;
      // 뷰카운트 검증
      const view = await this.redisService.existsCount(key);
      // 중복 안될때
      if (!view) {
        // 레디스에 정보등록
        await this.redisService.saveCount(key, '1');
        // 비디오 있니?
        const video = await this.videoRepository.findOneBy({ id: videoId });
        if (!video) throw new NotFoundException('존재하지 않는 영상입니다.');
        video.viewCount += 1;
        await this.videoRepository.save(video);
      }
      // 비디오 있니? 중복됫네.... ㅠㅠ
      const video = await this.videoRepository.findOneBy({ id: videoId });
      if (!video) throw new NotFoundException('존재하지 않는 영상입니다.');
      return {
        message: '조회수 처리 완료',
        videoId: video.id,
        viewCount: video.viewCount,
      };
    } catch (error) {
      throw new BadRequestException('조회수 처리 중 오류가 발생했습니다.');
    }
  }
  // 영상 좋아요
  async toggleLike(videoId: string, info?: CreateUserDto) {
    try {
      const user = await this.findOrCreateUserByInfo(info);
      // 영상 있니?
      const videoEx = await this.videoRepository
        .createQueryBuilder('video')
        .where('video.id = :video', { videoId })
        .getExists();
      if (!videoEx) {
        throw new NotFoundException('존재하지 않는 영상입니다.');
      }
      // 좋아요 되있니?
      const likeEx = await this.likeRepository
        .createQueryBuilder('like')
        .where('like.userId = :userId', { userId: user.id })
        .andWhere('like.videoId = :videoId', { videoId })
        .getOne();
      // 있으면 삭제
      if (likeEx) {
        await this.likeRepository.remove(likeEx);
      } else {
        // 없으면 좋아용
        await this.likeRepository
          .createQueryBuilder()
          .insert()
          .into('likes')
          .values({ user: { id: user.id }, video: { id: videoId } })
          .execute();
      }
      const { likeCount } = await this.likeRepository
        .createQueryBuilder('like')
        .select('COUNT(*)', 'likeCount')
        .where('like.videoId = :videoId', { videoId })
        .getRawOne();
      // execute 데이터를 바꿀때 사용한당
      return {
        message: likeEx ? '좋아요 취소' : '좋아요',
        liked: !likeEx,
        likeCount: Number(likeCount),
      };
    } catch (error) {
      throw new BadRequestException('좋아요 처리 중 오류가 발생했습니다.');
    }
  }

  // 유저 조회
  async findOrCreateUserByInfo(info: CreateUserDto): Promise<User> {
  let user = await this.userRepository.findOne({
    where: { email: info.email },
  });

  if (!user) {
    user = this.userRepository.create({
      email: info.email,
      username: info.username
    });
    await this.userRepository.save(user);
  }

  return user;
}
}
