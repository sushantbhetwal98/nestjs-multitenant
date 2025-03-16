import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}
