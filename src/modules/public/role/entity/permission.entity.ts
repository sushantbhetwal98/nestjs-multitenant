import { RESOURCE_ACTIONS, RESOURCES } from 'common/data/constants';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Role, (role) => role.permissions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'enum', enum: RESOURCES, nullable: false })
  resource: string;

  @Column({ type: 'enum', enum: RESOURCE_ACTIONS, nullable: true })
  actions: string[];
}
