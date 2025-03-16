import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entity/workspace.entity';
import { CreateWorkspaceDto } from './dto/workspace.dto';
import { UserInfoInterface } from '../user/interface/userInfo.interface';
import roles from 'common/data/defaultRoles.json';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
  ) {}

  async createWorkspace(
    createWorkspacePayload: CreateWorkspaceDto,
    user: UserInfoInterface,
  ) {
    try {
      const workspaceToSave = {
        ...createWorkspacePayload,
        owner: { id: user.id },
        role: roles.defaultRoles,
      };

      console.log('data', workspaceToSave);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
