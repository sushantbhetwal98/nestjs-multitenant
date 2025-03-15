import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfoInterface } from 'src/modules/public/user/interface/userInfo.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfoInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.userInfo;
  },
);
