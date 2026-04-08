import {
  Gathering,
  JammitUser,
  PreferredBandSession,
  PreferredGenre,
} from '@/database/entities';
import {
  BandSession,
  GatheringStatus,
  Genre,
  OauthPlatform,
} from '@/jammit-shared/jammit.enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JammitUserService {
  constructor(
    @InjectRepository(JammitUser)
    private readonly userRepo: Repository<JammitUser>,
    @InjectRepository(PreferredGenre)
    private readonly pgRepo: Repository<PreferredGenre>,
    @InjectRepository(PreferredBandSession)
    private readonly pbsRepo: Repository<PreferredBandSession>,
    @InjectRepository(Gathering)
    private readonly gatheringRepo: Repository<Gathering>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getUserInfo(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['preferredGenres', 'userBandSessions'],
    });
    if (!user) throw new BadRequestException('유저를 찾지 못하였습니다');
    const totalCreatedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id } },
    });
    const completedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id }, status: GatheringStatus.COMPLETED },
    });
    return this.buildUserResponse(user, totalCreatedGatheringCount, completedGatheringCount);
  }

  async register(dto: {
    email: string;
    password: string;
    username: string;
    nickname: string;
    preferredGenres?: Genre[];
    preferredBandSessions?: BandSession[];
  }) {
    if (await this.userRepo.exists({ where: { email: dto.email } })) {
      throw new BadRequestException('이메일이 중복되었습니다.');
    }
    const user = this.userRepo.create({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      username: dto.username,
      nickname: dto.nickname,
      oauthPlatform: OauthPlatform.NONE,
    });
    await this.userRepo.save(user);
    if (dto.preferredGenres?.length) {
      await this.replacePreferredGenres(user.id, dto.preferredGenres);
    }
    if (dto.preferredBandSessions?.length) {
      await this.replacePreferredSessions(user.id, dto.preferredBandSessions);
    }
    const full = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['preferredGenres', 'userBandSessions'],
    })!;
    return this.buildUserResponse(full!, 0, 0);
  }

  async updateUser(
    email: string,
    dto: {
      email?: string;
      username?: string;
      password?: string;
      preferredGenres?: Genre[];
      preferredBandSessions?: BandSession[];
    },
  ) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['preferredGenres', 'userBandSessions'],
    });
    if (!user) throw new BadRequestException('유저를 찾지 못하였습니다');
    if (dto.email != null) user.email = dto.email;
    if (dto.username != null) user.username = dto.username;
    if (dto.password != null) user.password = await bcrypt.hash(dto.password, 10);
    await this.userRepo.save(user);
    await this.pgRepo.delete({ user: { id: user.id } });
    await this.pbsRepo.delete({ user: { id: user.id } });
    if (dto.preferredGenres?.length) {
      await this.replacePreferredGenres(user.id, dto.preferredGenres);
    }
    if (dto.preferredBandSessions?.length) {
      await this.replacePreferredSessions(user.id, dto.preferredBandSessions);
    }
    const full = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['preferredGenres', 'userBandSessions'],
    })!;
    const totalCreatedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id } },
    });
    const completedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id }, status: GatheringStatus.COMPLETED },
    });
    return this.buildUserResponse(full!, totalCreatedGatheringCount, completedGatheringCount);
  }

  async updateProfileImage(
    email: string,
    dto: { orgFileName?: string; profileImagePath?: string | null },
  ) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['preferredGenres', 'userBandSessions'],
    });
    if (!user) throw new BadRequestException('유저를 찾지 못하였습니다');
    if (dto.profileImagePath != null && dto.profileImagePath !== '') {
      if (!dto.orgFileName) {
        throw new BadRequestException('프로필 이미지 수정시 원본 파일 이름은 필수입니다.');
      }
      user.orgFileName = dto.orgFileName;
      user.profileImagePath = dto.profileImagePath;
    } else {
      user.orgFileName = null;
      user.profileImagePath = null;
    }
    await this.userRepo.save(user);
    const totalCreatedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id } },
    });
    const completedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id }, status: GatheringStatus.COMPLETED },
    });
    const full = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['preferredGenres', 'userBandSessions'],
    })!;
    return this.buildUserResponse(full!, totalCreatedGatheringCount, completedGatheringCount);
  }

  async checkEmailExists(email: string) {
    return { exists: await this.userRepo.exists({ where: { email } }) };
  }

  async uploadProfileImage(userId: number, file: Express.Multer.File) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('파일을 첨부하지 않았습니다.');
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('유저를 찾지 못하였습니다');

    const url = await this.uploadToSupabase(file);
    user.orgFileName = file.originalname;
    user.profileImagePath = url;
    await this.userRepo.save(user);
    return url;
  }

  private async uploadToSupabase(file: Express.Multer.File): Promise<string> {
    const base = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    const bucket = this.config.get<string>('STORAGE_BUCKET_NAME') ?? 'jimmit';
    if (!base || !key) {
      throw new BadRequestException('Supabase 스토리지 설정이 없습니다.');
    }
    const ext = file.originalname.includes('.')
      ? file.originalname.slice(file.originalname.lastIndexOf('.') + 1)
      : 'bin';
    const path = `profile/${randomUUID()}.${ext}`;
    const uploadUrl = `${base.replace(/\/$/, '')}/storage/v1/object/${bucket}/${path}`;
    await firstValueFrom(
      this.http.post(uploadUrl, file.buffer, {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': file.mimetype || 'application/octet-stream',
          'x-upsert': 'true',
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }),
    );
    return `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path}`;
  }

  private async replacePreferredGenres(userId: number, genres: Genre[]) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    for (let i = 0; i < genres.length; i++) {
      await this.pgRepo.save(
        this.pgRepo.create({ user, name: genres[i], priority: i }),
      );
    }
  }

  private async replacePreferredSessions(userId: number, sessions: BandSession[]) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    for (let i = 0; i < sessions.length; i++) {
      await this.pbsRepo.save(
        this.pbsRepo.create({ user, name: sessions[i], priority: i }),
      );
    }
  }

  private buildUserResponse(
    user: JammitUser,
    totalCreated: number,
    completed: number,
  ) {
    const preferredGenres = (user.preferredGenres ?? [])
      .sort((a, b) => a.priority - b.priority)
      .map((g) => g.name);
    const preferredBandSessions = (user.userBandSessions ?? [])
      .sort((a, b) => a.priority - b.priority)
      .map((s) => s.name);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferredGenres,
      preferredBandSessions,
      totalCreatedGatheringCount: totalCreated,
      completedGatheringCount: completed,
    };
  }
}
