import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Vimeo } from 'vimeo';
import { createUserDto, videoUploadDto } from './dto/video.dto';
import { Readable } from 'stream';
import { Like, User, Video } from '@/entities';
import { RedisService } from '@/redis/redis.service';
@Injectable()
export class VideoService {
  private readonly vimeoClient: Vimeo;
  private readonly logger = new Logger(VideoService.name);
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.vimeoClient = new Vimeo(
      this.configService.get<string>('VIMEO_ACCESS_TOKEN'),
      this.configService.get<string>('VIMEO_CLIENT_ID'),
      this.configService.get<string>('VIMEO_CLIENT_SECRET'),
    );
  }
  // 영상 업로드
  async uploadForVideo(
    info: createUserDto,
    body: videoUploadDto,
    file: Express.Multer.File,
  ) {
    // 사용자 확인
    let user = await this.userRepository.findOne({
      where: { email: info.email },
    });
    // 없으면 생성
    if (!user) {
      user = await this.userRepository.create(info);
      await this.userRepository.save(user);
    }
    // 업로드
    const { videoUrl, thumbnailUrl } = await this.uploadToVimeo(file, body);
    const video = await this.videoRepository.create({
      title: body.title,
      description: body.description,
      videoUrl: videoUrl,
      user,
      viewCount: 0,
      thumbnailUrl: thumbnailUrl,
    });
    const saveVideo = await this.videoRepository.save(video);

    return {
      message: '영상이 업로드 되었습니다.',
      url: saveVideo.videoUrl,
      count: saveVideo.viewCount,
      title: saveVideo.title,
      description: saveVideo.description,
      createDate: saveVideo.createdAt,
    };
  }
  private async uploadToVimeo(
    file: Express.Multer.File,
    body: videoUploadDto,
  ): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    return new Promise((resolve, reject) => {
      const stream = Readable.from(file.buffer);
      this.vimeoClient.upload(
        stream,
        { name: body.title, description: body.description },
        (url: string) => {
          const videoUrl = `https://vimeo.com${url}`;
          // 썸네일 내놔 이자식아
          this.vimeoClient.request(
            {
              method: 'GET',
              path: url,
            },
            (error, body, statusCode, headers) => {
              if (error) {
                this.logger.error('메타 데이터 요청 실패', error);
                return reject(error);
              }
              const size = body?.pictures?.sizes;
              const thumbnailUrl = size?.[3]?.link || size?.[0]?.link;
              resolve({ videoUrl, thumbnailUrl });
            },
          );
        },
        // 업로드 퍼센트
        (uploaded, total) => {
          const percent = ((uploaded / total) * 100).toFixed(2);
          this.logger.log(`업로드퍼센트: ${percent}%`);
        },
        (error) => {
          this.logger.error('vimeo에 업로드 실패', error);
          reject(error);
        },
      );
    });
  }
  // 모든 영상 뿌리기
  async getVideos(
    take: number,
    lastCreatedAt?: Date,
    order: 'latest' | 'popular' = 'latest',
  ) {
    const video = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .leftJoinAndSelect('video.comment', 'comment')
      .leftJoinAndSelect('video.like', 'like')
      .take(take)
      .orderBy(
        order === 'popular' ? 'video.viewCount' : 'video.createdAt',
        'DESC',
      );
    if (lastCreatedAt && order === 'latest') {
      video.where('video.createdAt < :lastCreatedAt', { lastCreatedAt });
    }
    const videos = await video.getMany();
    return {
      nextCursor:
        videos.length > 0 ? videos[videos.length - 1].createdAt : null,
      data: videos,
    };
  }
  // 내가 올린 영상
  async getMyVideos(
    info: createUserDto,
    take: number,
    skip: number,
    order: 'latest' | 'popular',
  ) {
    const user = await this.userRepository.findOne({
      where: { email: info.email },
    });
    // 유저 인증은 됫지만 내디비에는 없을경우
    if (!user) {
      return {
        total: 0,
        data: [],
      };
    }
    const video = this.videoRepository
      .createQueryBuilder('video')
      .where('video.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('video.comment', 'comment')
      .leftJoinAndSelect('video.like', 'like')
      .orderBy(
        order === 'popular' ? 'video.viewCount' : 'video.createdAt',
        'DESC',
      )
      .skip(skip)
      .take(take);

    const [videos, total] = await video.getManyAndCount();
    return {
      total,
      data: videos,
    };
  }
  // 뷰 카운트
  async viewCountVideos(videoId: string, info?: createUserDto, ip?: string) {
    let userIdForRedis: string;
    if (info.email) {
      // 영상을 본사람들도 댓글 좋아요 쓸수 잇어야하니... 유저 정보에 들어가게 한다.
      let user = await this.userRepository.findOne({
        where: { email: info.email },
      });
      if (!user) {
        user = await this.userRepository.create(info);
        await this.userRepository.save(user);
        userIdForRedis = user.id;
      }
    } else if (ip) {
      // 비회원 도 카운트 늘려야되용....
      userIdForRedis = `guest:${ip}`;
    } else {
      throw new BadRequestException('유저 식별이 불가능합니다.');
    }

    const key = `view:${userIdForRedis}:${videoId}`;
    // 뷰카운트 검증
    const viewd = await this.redisService.existsCount(key);
    // 중복 안될때
    if (!viewd) {
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
  }
  // 영상 좋아요
  async toggleLike(videoId: string, info?: createUserDto) {
    let user = await this.userRepository.findOne({
      where: { email: info.email },
    });
    if (!user) {
      user = await this.userRepository.create(info);
      await this.userRepository.save(user);
    }
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
  };
}
