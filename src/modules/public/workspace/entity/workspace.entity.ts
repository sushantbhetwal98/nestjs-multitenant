import { AbstractEntity } from 'database/entity/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Role } from '../../role/entity/role.entity';

@Entity({ name: 'workspace' })
export class Workspace extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Role, (role) => role.workspace, {
    nullable: false,
    cascade: true,
  })
  roles: Role[];
}
