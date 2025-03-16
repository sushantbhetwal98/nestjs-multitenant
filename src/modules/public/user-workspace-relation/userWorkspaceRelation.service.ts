import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkspaceRelation } from './entity/userWorkspaceRelation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserWorkspaceRelationService {
  constructor(
    @InjectRepository(UserWorkspaceRelation)
    private readonly userWorkspaceRelationRepo: Repository<UserWorkspaceRelation>,
  ) {}
}
