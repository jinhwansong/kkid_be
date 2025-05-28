import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Mux from '@mux/mux-node';
import { User } from '@/entities';
import { createUserDto } from '@/video/dto/video.dto';


@Injectable()
export class MuxService {
  private mux:Mux;
  private video:Mux['video']
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.mux = new Mux({
      tokenId: this.configService.get<string>('MUX_ACCESS_TOKEN'),
      tokenSecret: this.configService.get<string>('MUX_SECRET_KEY'),
    });
  }
  // direct upload용 URL 발급
  async createDirectUpload(info: createUserDto): Promise<{
    uploadUrl: string;
    uploadId: string;
  }> {
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
    const upload = await this.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
      },
      cors_origin: process.env.FRONTEND_URL,
    });
    return { uploadUrl: upload.url, uploadId: upload.id };
  }
  async getMuxPlaybackInfo(
    uploadId: string,
  ): Promise<{ playbackUrl: string; thumbnailUrl: string }> {
    const upload = await (this.video.uploads as any).get(uploadId);
    const assetId = upload.asset_id;
    if (!assetId) throw new Error('영상 업로드 중 입니다.');
    const asset = await this.video.assets.retrieve(assetId);
    const playbackId = asset.playback_ids?.[0]?.id;
    if (!playbackId) throw new Error('Playback ID 없음');
    const thumbnailUrl =
      asset.static_renditions?.status === 'ready'
        ? `https://image.mux.com/${playbackId}/thumbnail.jpg`
        : '';
    return {
      playbackUrl: `https://stream.mux.com/${playbackId}.m3u8`,
      thumbnailUrl: thumbnailUrl,
    };
  }
}
