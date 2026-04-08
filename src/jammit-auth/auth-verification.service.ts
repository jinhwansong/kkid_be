import { JammitUser } from '@/database/entities';
import { CreateUserDto } from '@/video/dto/user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JammitJwtService } from './jammit-jwt.service';

export type VerifiedJammitSession = {
  profile: CreateUserDto;
  jammitUser: JammitUser;
};

@Injectable()
export class AuthVerificationService {
  constructor(
    private readonly jammitJwt: JammitJwtService,
    @InjectRepository(JammitUser)
    private readonly jammitUserRepo: Repository<JammitUser>,
  ) {}

  /** 비디오/댓글 가드용 — JWT 검증 후 `users`(Jammit) 로드 → `req.user` + `req.jammitUser` */
  async verifyTokenAndGetUser(token: string): Promise<VerifiedJammitSession> {
    const { loginId } = this.jammitJwt.verifyAccessToken(token);
    const user = await this.jammitUserRepo.findOne({
      where: { email: loginId },
      relations: ['preferredGenres', 'userBandSessions'],
    });
    if (!user) throw new UnauthorizedException('인증되지 않은 사용자');

    const profile: CreateUserDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      profileImagePath: user.profileImagePath ?? '',
    } as CreateUserDto;

    return { profile, jammitUser: user };
  }
}
