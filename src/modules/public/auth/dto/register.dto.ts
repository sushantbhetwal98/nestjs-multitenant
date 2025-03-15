import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterUserDto {
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
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
