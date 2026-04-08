import { AuthVerificationService } from '@/jammit-auth/auth-verification.service';
import { JammitUser } from '@/database/entities';
import { extractBearerToken } from '@/common/utils/bearer-token.util';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authVerifService: AuthVerificationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractBearerToken(req.headers['authorization']);
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    try {
      const { profile, jammitUser } =
        await this.authVerifService.verifyTokenAndGetUser(token);
      req.user = profile;
      (req as { jammitUser?: JammitUser }).jammitUser = jammitUser;
      return true;
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
