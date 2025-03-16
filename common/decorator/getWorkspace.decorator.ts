import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WorkspaceInterface } from 'src/modules/public/workspace/interface/workspace.interface';

export const GetWorkpsace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): WorkspaceInterface | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.workspaceDetails;
  },
);
