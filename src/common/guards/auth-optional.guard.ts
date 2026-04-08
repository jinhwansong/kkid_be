import { AuthVerificationService } from '@/jammit-auth/auth-verification.service';
import { JammitUser } from '@/database/entities';
import { extractBearerToken } from '@/common/utils/bearer-token.util';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthOptionalGuard implements CanActivate {
  constructor(private readonly authVerifService: AuthVerificationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractBearerToken(req.headers['authorization']);
    if (token) {
      try {
        const { profile, jammitUser } =
          await this.authVerifService.verifyTokenAndGetUser(token);
        req.user = profile;
        (req as { jammitUser?: JammitUser }).jammitUser = jammitUser;
      } catch {
        /* 비로그인 허용 */
      }
    }
    return true;
  }
}
