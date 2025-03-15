import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'First Name must be 2 to 50 characters long' })
  @MinLength(2, { message: 'First Name must be 2 to 50 characters long' })
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Middle Name must be 2 to 50 characters long' })
  @MinLength(2, { message: 'Middle Name must be 2 to 50 characters long' })
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Last Name must be 2 to 50 characters long' })
  @MaxLength(50, { message: 'Last Name must be 2 to 50 characters long' })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordSalt: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsDate()
  otpExpiry: Date;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
