import { Like, User, Video } from '@/entities';
import { MuxService } from '@/mux/mux.service';
import { RedisService } from '@/redis/redis.service';
import { UserService } from '@/user/user.service';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';
import * as crypto from 'crypto';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { RegisterMuxVideoDto } from './dto/mux.dto';
import { CreateUserDto } from './dto/user.dto';

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
    private readonly userService: UserService,
    private readonly muxService: MuxService, 
    
  ) {}
   
  // 영상 목록 상세
  async getVideosWithDetail(videoId: string) {
    try {
      const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .select([
        'video.id AS id',
        'video.title AS title',
        'video.description AS description',
        'video.playbackId AS playbackId',
        'video.viewCount AS viewCount',
        'video.createdAt AS createdAt',
        'video.thumbnailUrl AS thumbnailUrl',
        'user.nickname AS nickname',
        'user.userId AS userId',
      ])
      .where('video.id = :videoId', { videoId })
      .getRawOne();
      if (!video) {
        throw new NotFoundException('해당 영상이 존재하지 않습니다.');
      }
      return {
        id: video.id,
        title: video.title,
        playbackId: video.playbackId,
        viewCount: Number(video.viewCount),
        description:video.description,
        nickname: video.nickname,
        userId: video.userId,
        thumbnailUrl:video.thumbnailUrl,
        createdAt: video.createdAt,
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

  // 좋아요 여부
  async isVideoLikedByUser(videoId: string, userId: number): Promise<boolean> {
    const count = await this.likeRepository.count({ where: { video: { id: videoId }, user: { userId } } });
    return count > 0;
  }

  async getLikeStatus(videoId: string, userId: number) {
    // 전체 좋아요 개수
    const likeCount = await this.likeRepository.count({
      where: { video: { id: videoId } },
    });
    // 유저별 좋아요 여부
    const liked = await this.isVideoLikedByUser(videoId, userId);

    return { liked, likeCount };
  }

  // 영상 좋아요
  async toggleLike(videoId: string, info?: CreateUserDto) {
    try {
      const user = await this.userService.findOrCreateUser(info);
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

  // 웹훅
  async muxWebHook(req, res) {
    const rawBuf: Buffer = req.body;
    const rawBody = rawBuf.toString('utf8');
    const signature = req.headers['mux-signature'] as string;
    if (!signature) return res.status(403).send('Missing signature');

     // 3) t=,v1= 파싱
  const [tPart, v1Part] = signature.split(',');
  const timestamp = tPart.slice(2);   // remove 't='
  const provided  = v1Part.slice(3);  // remove 'v1='

  // 4) 시크릿 로드
  const secretRaw = process.env.MUX_WEBHOOK_SECRET
  if (!secretRaw) {
    return res.status(500).send('Webhook secret not configured');
  }

    const secret = secretRaw.trim();

    // 5) HMAC 입력값(Buffer) 생성
    const hmacInput = Buffer.concat([
      Buffer.from(timestamp + '.', 'utf8'),
      rawBuf
    ]);

    // 6) expected HMAC 계산
    const expected = crypto
      .createHmac('sha256', secret)
      .update(hmacInput)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(provided, 'hex')
    );
    if (!isValid) {
      Sentry.captureMessage('MUX Webhook Signature Invalid', { level: 'warning' });
      return res.status(403).send('Invalid signature');
    }

    // 검증 통과 후 JSON 파싱
    const payload = JSON.parse(rawBody);

    if (payload.type === 'video.asset.ready') {
      const asset = payload.data;
      const playbackId = asset.playback_ids?.[0]?.id;
      const uploadId = asset.upload_id;

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const playbackUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      const video = await this.videoRepository.findOne({
        where: { uploadId },
      });
      const totalSeconds = Math.floor(asset.duration);
      const hours   = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // 두 자리 숫자 패딩
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');

      // 결과: "HH:MM:SS"
      const formatted = hh === '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;

      if (video) {
        video.playbackId = playbackId;
        video.thumbnailUrl = thumbnailUrl;
        video.videoUrl = playbackUrl;
        video.duration = formatted
        video.assetId = asset.id;
        await this.videoRepository.save(video);
      }
    }
    return res.status(200).json({ received: true });
  }
  
  // 사용자가 업로드 후 등록 요청을 보냄
  async registerMuxVideo(info: CreateUserDto , body: RegisterMuxVideoDto) {
    try {
      const user = await this.userService.findOrCreateUser(info);
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
      if (info?.email) {
        // 영상을 본사람들도 댓글 좋아요 쓸수 잇어야하니... 유저 정보에 들어가게 한다.
        const user = await this.userService.findOrCreateUser(info);
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
      console.log("error",error)
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
  
  // 전체 영상 목록 리스트
  async getVideosWithPagination(
    limit: number = 10,
    page: number = 1,
    order: 'latest' | 'popular',
  ) {
    try {
      const safePage = Math.max(1, page);
      const skip = Math.max(0, (safePage - 1) * limit);

      const [results, total] = await this.videoRepository
        .createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .orderBy(
          order === 'latest' ? 'video.createdAt' : 'video.viewCount',
          'DESC',
        )
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const data = results.map(v => ({
        id: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        nickname: v.user.nickname,
        createdAt: v.createdAt,
        viewCount: v.viewCount,
        duration: v.duration
      }));

      // 이번주 top 1
      const weekTopVideo = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.createdAt >= :weekStart', {
        weekStart:dayjs().startOf('week').toDate()
      })
      .orderBy('video.viewCount', 'DESC')
      .addOrderBy('video.createdAt', 'ASC')
      .select(['video.id'])
      .getOne();
      return {
        
        totalPage:  Math.ceil(total / limit),
        page: Math.floor(skip / limit) + 1,
        data,
        message: '전체 영상 목록을 조회했습니다.',
        weekTopVideo
      };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('method', 'getVideosWithPagination');
        scope.setExtra('params', { limit, page, order });
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
    limit: number = 10,
    page: number = 1,
    order: 'latest' | 'popular') {
      try {
        const safePage = Math.max(1, page);
        const skip = Math.max(0, (safePage - 1) * limit);
        const user = await this.userRepository.findOneBy({ userId: userInfo });
        if (!user) {
          return {
            totalPage: 0,
            page:0,
            data:[],
            message:'유저가 업로드한 영상 목록을 조회했습니다.',
          };
        }
        const [video, total] = await this.videoRepository
          .createQueryBuilder('video')
          .leftJoinAndSelect('video.user', 'user')
          .where('video.userId  = :id ', { id: user.id  })
          .orderBy(
            order === 'latest' ? 'video.createdAt' : 'video.viewCount',
            'DESC',
          )
          .skip(skip)
          .take(limit)
          .getManyAndCount();

          const data = video.map(v => ({
            id: v.id,
            title: v.title,
            thumbnailUrl: v.thumbnailUrl,
            nickname: v.user.nickname,
            createdAt: v.createdAt,
            viewCount: v.viewCount,
            duration: v.duration
          }));

        return {
          totalPage:  Math.ceil(total / limit),
          page: Math.floor(skip / limit) + 1,
          data,
          message: '유저 영상 목록을 조회했습니다.',
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
  // 영상 개수만 반환
  async getMyVideoTotal (userInfo: number) {
    try {
      const user = await this.userRepository.findOneBy({ userId: userInfo });
    if (!user) {
      return { count: 0, message: '유저가 없습니다.' };
    }

    const count = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.userId = :userId', { userId: user.id })
      .getCount();

    return {
      count,
      message: '업로드한 영상 개수를 조회했습니다.',
    };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('method', 'getMyVideoCount');
        scope.setExtra('userId', userInfo);
        Sentry.captureException(error);
      });
      throw new BadRequestException(
        '영상 개수를 불러오는 중 오류가 발생했습니다.',
      );
    }
  }

  // 영상 삭제
  async deleteVideo(videoId: string, userId: number) {
  const video = await this.videoRepository.findOne({
    where: { id: videoId },
    relations: ['user'],
  });

  if (!video) throw new NotFoundException('영상이 존재하지 않습니다.');
  if (video.user.userId !== userId) throw new ForbiddenException('삭제 권한이 없습니다.');

  try {
    await this.muxService.deleteAsset(video.assetId, {
      email: video.user.email,
      nickname: video.user.nickname,
    });

    await this.videoRepository.remove(video);

    return { message: '영상이 삭제되었습니다.' };
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag('task', 'video-delete');
      scope.setExtra('videoId', video.id);
      scope.setUser({ email: video.user.email });
      scope.setContext('영상 삭제 실패', {
        이유: 'Mux 삭제 혹은 DB 삭제 중 오류',
        assetId: video.assetId,
      });
      Sentry.captureException(error);
    });
    throw new InternalServerErrorException('영상 삭제 중 오류가 발생했습니다.');
  }
}
}
