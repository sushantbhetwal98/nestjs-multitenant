import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RoleModule } from './role/role.module';
import { UserWorkspaceRelationModule } from './user-workspace-relation/userWorkspaceRelation.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WorkspaceModule,
    RoleModule,
    UserWorkspaceRelationModule,
  ],
})
export class PublicModule {}
