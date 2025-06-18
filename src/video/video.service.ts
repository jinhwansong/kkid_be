import { Like, User, Video } from '@/entities';
import { RedisService } from '@/redis/redis.service';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';
import * as crypto from 'crypto';
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
   // 전체 영상 목록 리스트
  async getVideosWithPagination(
    take: number = 10,
    skip: number = 0,
    order: 'latest' | 'popular',
  ) {
    try {
      const video = this.videoRepository
        .createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .select([
          'video.id AS id',
          'video.title AS title',
          'video.thumbnailUrl AS thumbnailUrl',
          'user.nickname AS nickname',
          'video.createdAt AS createdAt',
        ])
        .orderBy(order === 'latest' ? 'video.createdAt' : 'video.viewCount', 'DESC')
        .take(take)
        .skip(skip)
      const rawVideos = await video.getRawMany();
      const total = await this.videoRepository
        .createQueryBuilder('video')
        .getCount();
      return {
        page: Math.floor(skip / take) + 1,
        take,
        total,
        totalPages: Math.ceil(total / take),
        data: rawVideos,
      };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('method', 'getVideosWithPagination');
        scope.setExtra('params', { take, skip, order });
        scope.setContext('영상 목록 에러', {
          메시지: '영상 목록을 불러오는 중 오류가 발생했습니다.',
        });
        Sentry.captureException(error);
      });
      throw new BadRequestException('영상 목록을 불러오는 중 오류가 발생했습니다.');

    }
  }
  // 내가 올린 영상목록
  async getMyVideos (
    userInfo: number,
    take: number = 10,
    skip: number = 0,
    order: 'latest' | 'popular') {
      try {
        const user = await this.userRepository.findOneBy({ userId: userInfo });
        if (!user) {
          return {
            page: Math.floor(skip / take) + 1,
            take,
            total: 0,
            totalPages: 0,
            data: [],
          };
        }
        const video = this.videoRepository
          .createQueryBuilder('video')
          .leftJoinAndSelect('video.user', 'user')
          .where('video.userId  = :id ', { id: user.id  })
          .select([
            'video.id AS id',
            'video.title AS title',
            'video.thumbnailUrl AS thumbnailUrl',
            'user.nickname AS nickname',
            'video.createdAt AS createdAt',
          ])
          .orderBy(order === 'latest' ? 'video.createdAt' : 'video.viewCount', 'DESC')
          .take(take)
          .skip(skip)
          const rawVideos = await video.getRawMany();
          const total = await this.videoRepository
            .createQueryBuilder('video')
            .getCount();
        return {
          page: Math.floor(skip / take) + 1,
          take,
          total,
          totalPages: Math.ceil(total / take),
          data:rawVideos,
        };
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setTag('method', 'getMyVideos');
          scope.setExtra('userId', userInfo);
          scope.setContext('내 영상 목록 에러', {
            메시지: '내가 업로드한 영상 목록을 불러오는 중 오류',
          });
          Sentry.captureException(error);
        });
        throw new BadRequestException(
          '영상 목록을 불러오는 중 오류가 발생했습니다.',
        );

      }
  }
  // 영상 목록 상세
  async getVideosWithDetail(videoId: string) {
    try {
      const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .select([
        'video.id AS id',
        'video.title AS title',
        'video.viewCount AS viewCount',
        'video.description AS description',
        'video.videoUrl AS videoUrl',
        'user.nickname AS nickname',
        'user.username AS username',
        'user.userId AS userId',
      ])
      .addSelect((subQuery) =>
        subQuery
          .select('COUNT(*)')
          .from('like', 'l')
          .where('l.videoId = video.id'),
        'likeCount',
      )
      .where('video.id = :videoId', { videoId })
      .getRawOne();
      if (!video) {
        throw new NotFoundException('해당 영상이 존재하지 않습니다.');
      }
      return {
         id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        viewCount: Number(video.viewCount),
        likeCount: Number(video.likeCount),
        nickname: video.nickname,
        username: video.username,
        userId: video.userId,
      }


    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('method', 'getVideosWithDetail');
        scope.setExtra('videoId', videoId);
        scope.setContext('상세 영상 에러', {
          메시지: '영상 상세를 불러오는 중 오류',
        });
        Sentry.captureException(error);
      });
      throw new BadRequestException(
        '영상 상세데이터를 불러오는 중 오류가 발생했습니다.',
      );
    }
  }
  // 웹훅
  async muxWebHook(req, res) {
    const secret = process.env.NODE_ENV === 'production' ? process.env.MUX_WEBHOOK_SECRET_NEST : process.env.MUX_WEBHOOK_SECRET;
    const signature = req.headers['mux-signature'] as string;
    const rawBody = (req as any).rawBody;

    // 서명 검증 로직
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const isValid = signature?.includes(expected);
    if (!isValid) {
  Sentry.captureMessage('MUX Webhook Signature Invalid', {
    level: 'warning',
    extra: {
      receivedSignature: signature,
      expectedHash: expected,
      eventHeaders: req.headers,
    },
  });

  return res.status(403).send('Invalid signature');
}

    const payload = JSON.parse(rawBody.toString());

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
      Sentry.withScope((scope) => {
        scope.setTag('method', 'registerMuxVideo');
        scope.setExtra('user', info.email);
        scope.setContext('Mux 등록 에러', {
          메시지: '영상 등록 중 오류',
        });
        Sentry.captureException(error);
      });
      throw new InternalServerErrorException(
        '영상 등록 중 오류가 발생했습니다.',
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
      Sentry.withScope((scope) => {
        scope.setTag('method', 'viewCountVideos');
        scope.setExtra('videoId', videoId);
        scope.setContext('조회수 처리 에러', {
          메시지: '조회수 처리 중 오류 발생',
        });
        Sentry.captureException(error);
      });
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
        .where('video.id = :video', { video: videoId })
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
          .into('like')
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
      Sentry.withScope((scope) => {
        scope.setTag('method', 'toggleLike');
        scope.setExtra('videoId', videoId);
        scope.setContext('좋아요 에러', {
          메시지: '좋아요 처리 중 오류 발생',
        });
        Sentry.captureException(error);
      });
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
        username: info.username,
        nickname:info.nickname,
        userId:info.id
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
