import { AbstractEntity } from 'database/entity/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';
import { Workspace } from '../../workspace/entity/workspace.entity';

@Entity({ name: 'role' })
export class Role extends AbstractEntity {
  @Column({ type: 'boolean', nullable: false, default: true })
  isMutable: boolean;

  @ManyToOne(() => Workspace, (workspace) => workspace.roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => Permission, (permission) => permission.role, {
    nullable: false,
    cascade: true,
  })
  permissions: Permission[];
}
