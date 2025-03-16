import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserWorkspaceRelation } from './entity/userWorkspaceRelation.entity';

@Injectable()
export class UserWorkspaceRelationService {
  constructor(
    private readonly connection: DataSource,
    @InjectRepository(UserWorkspaceRelation)
    private readonly userWorkspaceRelationRepo: Repository<UserWorkspaceRelation>,
  ) {}

  async createUserWorkspaceRelationQueryRunner(
    userId: string,
    workspaceId: string,
    roleId: string,
    queryRunner: QueryRunner,
  ) {
    try {
      const dataToSave = {
        user: { id: userId },
        workspace: { id: workspaceId },
        role: { id: roleId },
      };
      const data = await queryRunner.manager.save(
        UserWorkspaceRelation,
        dataToSave,
      );

      console.log(data);

      if (!data) {
        throw new InternalServerErrorException('something went wrong');
      }
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async getUserWorkspaceRelation(userId: string, workspaceId: string) {
    try {
      const data = await this.userWorkspaceRelationRepo
        .createQueryBuilder('userWorkspaceRelation')
        .leftJoinAndSelect('userWorkspaceRelation.user', 'user')
        .leftJoinAndSelect('userWorkspaceRelation.workspace', 'workspace')
        .leftJoinAndSelect('userWorkspaceRelation.role', 'role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .getOne();

      if (!data) {
        throw new NotFoundException('User Company Relation Doesnot exists');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}
