import { AbstractEntity } from 'database/entity/abstract.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity({ name: 'user' })
@Unique(['email'])
export class User extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  middleName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  passwordSalt: string;

  @Column({ type: 'varchar', nullable: false })
  otp: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  otpExpiry: Date;
}
