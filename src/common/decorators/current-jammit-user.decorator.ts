import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JammitUser } from '@/database/entities';

export const CurrentJammitUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JammitUser => {
    const req = ctx.switchToHttp().getRequest<{ jammitUser: JammitUser }>();
    return req.jammitUser;
  },
);
