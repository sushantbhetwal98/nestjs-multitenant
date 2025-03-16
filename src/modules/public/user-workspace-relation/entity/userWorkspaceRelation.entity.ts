import { AbstractEntity } from 'database/entity/abstract.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../../role/entity/role.entity';
import { User } from '../../user/entity/user.entity';
import { Workspace } from '../../workspace/entity/workspace.entity';

@Entity({ name: 'user_workspace_relation' })
export class UserWorkspaceRelation extends AbstractEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Workspace, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
