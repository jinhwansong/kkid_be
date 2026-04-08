import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export type JammitJwtPayload = {
  loginId: string;
  type: 'access' | 'refresh';
};

@Injectable()
export class JammitJwtService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private get secret(): string {
    const s = this.config.get<string>('JWT_SECRET_KEY');
    if (!s) throw new Error('JWT_SECRET_KEY is required');
    return s;
  }

  private get accessMs(): number {
    return Number(this.config.get('JWT_EXPIRED_ACCESS_MS') ?? 86400000);
  }

  private get refreshMs(): number {
    return Number(this.config.get('JWT_EXPIRED_REFRESH_MS') ?? 86400000);
  }

  createAccessToken(loginId: string): string {
    return this.jwt.sign(
      { loginId, type: 'access' } satisfies JammitJwtPayload,
      {
        secret: this.secret,
        expiresIn: Math.floor(this.accessMs / 1000),
      },
    );
  }

  createRefreshToken(loginId: string): string {
    return this.jwt.sign(
      { loginId, type: 'refresh' } satisfies JammitJwtPayload,
      {
        secret: this.secret,
        expiresIn: Math.floor(this.refreshMs / 1000),
      },
    );
  }

  getAccessTokenExpiredAt(): Date {
    return new Date(Date.now() + this.accessMs);
  }

  verifyAccessToken(token: string): JammitJwtPayload {
    let payload: JammitJwtPayload;
    try {
      payload = this.jwt.verify<JammitJwtPayload>(token, {
        secret: this.secret,
      });
    } catch {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
    if (payload.type !== 'access') {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    return payload;
  }

  refreshAccessToken(refreshToken: string): string {
    let payload: JammitJwtPayload;
    try {
      payload = this.jwt.verify<JammitJwtPayload>(refreshToken, {
        secret: this.secret,
      });
    } catch {
      throw new UnauthorizedException('만료된 토큰 값입니다.');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('토큰값이 다릅니다.');
    }
    return this.createAccessToken(payload.loginId);
  }
}
