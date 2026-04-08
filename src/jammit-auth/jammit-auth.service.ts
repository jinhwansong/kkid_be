import { Gathering, JammitUser } from '@/database/entities';
import { GatheringStatus, OauthPlatform } from '@/jammit-shared/jammit.enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JammitJwtService } from './jammit-jwt.service';

@Injectable()
export class JammitAuthService {
  constructor(
    @InjectRepository(JammitUser)
    private readonly userRepo: Repository<JammitUser>,
    @InjectRepository(Gathering)
    private readonly gatheringRepo: Repository<Gathering>,
    private readonly jammitJwt: JammitJwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email, oauthPlatform: OauthPlatform.NONE },
      relations: ['preferredGenres', 'userBandSessions'],
    });
    if (!user) {
      throw new BadRequestException('가입되지 않은 이메일입니다.');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    const totalCreatedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id } },
    });
    const completedGatheringCount = await this.gatheringRepo.count({
      where: { createdBy: { id: user.id }, status: GatheringStatus.COMPLETED },
    });

    const exp = this.jammitJwt.getAccessTokenExpiredAt();
    return {
      user: this.toUserResponse(user, totalCreatedGatheringCount, completedGatheringCount),
      accessToken: this.jammitJwt.createAccessToken(email),
      refreshToken: this.jammitJwt.createRefreshToken(email),
      expiredAt: exp.toISOString().slice(0, 19),
    };
  }

  refresh(refreshToken: string) {
    const accessToken = this.jammitJwt.refreshAccessToken(refreshToken);
    const exp = this.jammitJwt.getAccessTokenExpiredAt();
    return {
      accessToken,
      refreshToken,
      expiredAt: exp.toISOString().slice(0, 19),
    };
  }

  private toUserResponse(
    user: JammitUser,
    totalCreatedGatheringCount: number,
    completedGatheringCount: number,
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
      totalCreatedGatheringCount,
      completedGatheringCount,
    };
  }
}
