import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RESOURCE_ACTIONS, RESOURCES } from 'common/data/constants';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsEnum(RESOURCES)
  resource: RESOURCES;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(RESOURCE_ACTIONS, { each: true })
  actions: RESOURCE_ACTIONS[];
}

export class CreateRoleAndPermissionsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  permissions: CreatePermissionDto[];
}

export class UpdatePermissionDto extends PartialType(
  CreateRoleAndPermissionsDto,
) {}
