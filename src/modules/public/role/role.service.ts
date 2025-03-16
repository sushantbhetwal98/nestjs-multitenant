import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleAndPermissionsDto } from './dto/rolesAndPermissions.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}
}
