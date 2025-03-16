import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import defaultRoles from '../../../../common/data/defaultRoles.json';
import { AuthService } from '../auth/auth.service';
import { UserWorkspaceRelationService } from '../user-workspace-relation/userWorkspaceRelation.service';
import { UserInfoInterface } from '../user/interface/userInfo.interface';
import { CreateWorkspaceDto } from './dto/workspace.dto';
import { Workspace } from './entity/workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly connection: DataSource,
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
    private readonly userWorkspaceRelationService: UserWorkspaceRelationService,
    private readonly authService: AuthService,
  ) {}

  async createWorkspace(
    createWorkspacePayload: CreateWorkspaceDto,
    user: UserInfoInterface,
  ) {
    let savedWorkspace: Workspace = null;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const workspaceToSave = await this.workspaceRepo.create({
        ...createWorkspacePayload,
        owner: { id: user.id },
        roles: defaultRoles.defaultRoles,
      });

      savedWorkspace = await queryRunner.manager.save(
        Workspace,
        workspaceToSave,
      );

      const adminRoleId = savedWorkspace.roles.find(
        (role) => !role.isMutable,
      ).id;
      await this.userWorkspaceRelationService.createUserWorkspaceRelationQueryRunner(
        user.id,
        savedWorkspace.id,
        adminRoleId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    const token = await this.authService.loginToWorkspace(
      user.id,
      savedWorkspace.id,
    );

    const { roles, owner, ...workspace } = savedWorkspace;
    return { workspace, user, token };
  }
}
