import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInterface } from 'src/modules/public/user/interface/user.interface';

export const GetUserDetail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.userDetail;
  },
);
