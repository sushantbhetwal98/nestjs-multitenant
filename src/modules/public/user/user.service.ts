import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUserById(userId: string) {
    try {
      const existingUser = await this.userRepo
        .createQueryBuilder()
        .where('id = :userId', { userId })
        .getOne();

      if (!existingUser) {
        throw new NotFoundException('User with the id not found');
      }
      return existingUser;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const existingUser = await this.userRepo
        .createQueryBuilder()
        .where('email = :email', { email })
        .getOne();

      return existingUser;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }

  async createUser(userPayload: CreateUserDto, queryRunner: QueryRunner) {
    try {
      const result = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(userPayload)
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with the email already exists.');
      }
      console.error(error);
      throw error;
    }
  }

  async updateUser(userId: string, userPayload: UpdateUserDto) {
    try {
      const updatedUser = await this.userRepo
        .createQueryBuilder()
        .update()
        .set(userPayload)
        .where('id = :userId', { userId })
        .returning('*')
        .execute();

      if (!updatedUser.affected) {
        throw new InternalServerErrorException(
          'Something went wrong. Please try again later.',
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }
}
