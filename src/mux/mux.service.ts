import { User } from '@/entities';
import { CreateUserDto } from '@/video/dto/user.dto';
import Mux from '@mux/mux-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';
import { Repository } from 'typeorm';

@Injectable()
export class MuxService {
  private mux: Mux;
  private video: Mux['video'];
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    try {
      const tokenId = this.configService.get<string>('MUX_ACCESS_TOKEN');
      const tokenSecret = this.configService.get<string>('MUX_SECRET_KEY');
      this.mux = new Mux({ tokenId, tokenSecret });
      this.video = this.mux.video;
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('task', 'mux-init');
        scope.setContext('Mux 초기화 실패', {
          이유: '환경 변수 누락 또는 잘못된 토큰',
        });
        Sentry.captureException(error);
      });
    }
  }

  // direct upload용 URL 발급
  async createDirectUpload(info: CreateUserDto): Promise<{
    uploadUrl: string;
    uploadId: string;
  }> {
    try {
      // 사용자 확인
      let user = await this.userRepository.findOne({
        where: { email: info.email },
      });
      // 없으면 생성
      if (!user) {
        user = await this.userRepository.create({
          email: info.email,
          username: info.username,
          nickname: info.nickname,
          userId: info.id,
        });
        await this.userRepository.save(user);
      }
      // 업로드
      const upload = await this.video.uploads.create({
        new_asset_settings: {
          playback_policy: ['public'],
        },
        cors_origin:
          process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL_NEXT
            : process.env.FRONTEND_URL,
      });
      return { uploadUrl: upload.url, uploadId: upload.id };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('task', 'video-upload');
        scope.setExtra('nickname', info.nickname);
        scope.setContext('업로드 URL 생성 실패', {
          이유: 'Mux API 응답 실패',
          사용자: info.email,
        });
        Sentry.captureException(error);
      });
      throw new Error('업로드 URL을 생성하는 데 실패했습니다.');
    }
  }

  async deleteAsset(
    assetId: string,
    info: { email: string; nickname: string },
  ) {
    try {
      await this.mux.video.assets.delete(assetId);
      return { success: true };
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('task', 'video-delete');
        scope.setExtra('nickname', info.nickname);
        scope.setContext('Mux 영상 삭제 실패', {
          이유: 'Mux API 응답 실패',
          사용자: info.email,
          assetId,
        });
        Sentry.captureException(error);
      });
      throw new Error('Mux 영상 삭제에 실패했습니다.');
    }
  }
}
