import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from 'common/guards/auth.guard';
import { CreateWorkspaceDto } from './dto/workspace.dto';
import { UserInfoInterface } from '../user/interface/userInfo.interface';
import { GetUser } from 'common/decorator/getUser.decorator';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createWorkspace(
    @Body() createWorkspacePayload: CreateWorkspaceDto,
    @GetUser() user: UserInfoInterface,
  ) {
    const data = await this.workspaceService.createWorkspace(
      createWorkspacePayload,
      user,
    );
    return data;
  }
}
