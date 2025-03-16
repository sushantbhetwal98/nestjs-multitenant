import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateOTP } from 'common/utils/generate-otp.utils';
import globalConfig from 'config/global.config';
import * as crypto from 'crypto';
import { DataSource } from 'typeorm';
import { EmailService } from '../../external-services/email/email.service';
import { RolesInterface } from '../role/interface/role.interface';
import { UserWorkspaceRelationService } from '../user-workspace-relation/userWorkspaceRelation.service';
import { User } from '../user/entity/user.entity';
import { UserInterface } from '../user/interface/user.interface';
import { UserService } from '../user/user.service';
import { WorkspaceInterface } from '../workspace/interface/workspace.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userWorkspaceRelationService: UserWorkspaceRelationService,
  ) {}

  private hashValue(value: string, defaultsalt?: string) {
    const salt = defaultsalt ?? crypto.randomBytes(16).toString('hex');
    const hashedValue = crypto
      .createHmac('sha256', salt)
      .update(value)
      .digest('hex');

    return {
      salt,
      hashedValue,
    };
  }

  private async createTokens(
    user: UserInterface,
    otherDetails: {
      isCompanyLogin: boolean;
      workspace?: WorkspaceInterface;
      role?: RolesInterface;
    },
  ) {
    if (
      otherDetails.isCompanyLogin &&
      (!otherDetails.workspace || !otherDetails.role)
    ) {
      throw new BadRequestException(
        'You Cannot login to company without company approval',
      );
    }

    const accessTokenPayload: any = {
      id: user.id,
      email: user.email,
    };

    if (otherDetails.isCompanyLogin) {
      (accessTokenPayload.workspaceId = otherDetails.workspace.id),
        (accessTokenPayload.roleId = otherDetails.role.id),
        (accessTokenPayload.permissions = otherDetails.role.permissions);
    }

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: globalConfig().AUTH.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: globalConfig().AUTH.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        workspaceId: otherDetails.isCompanyLogin
          ? otherDetails.workspace.id
          : null,
      },
      {
        secret: globalConfig().AUTH.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: globalConfig().AUTH.REFRESH_TOKEN_EXPIRY,
      },
    );

    return {
      accessToken,
      access_expires: this.jwtService.decode(accessToken).exp,
      refreshToken,
      refresh_expires: this.jwtService.decode(refreshToken).exp,
    };
  }

  async createUser(user: RegisterUserDto) {
    const { password, ...remainingData } = user;
    const generatedOtp = generateOTP();
    const hashedPasswordData = this.hashValue(password);

    // creating query runner for transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userPayload = {
        ...remainingData,
        isActive: false,
        password: hashedPasswordData.hashedValue,
        passwordSalt: hashedPasswordData.salt,
        otp: generatedOtp,
        otpExpiry: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes from now
      };

      const { password, passwordSalt, otp, ...savedUser } =
        await this.userService.createUser(userPayload, queryRunner);

      await this.emailService.sendOtp(
        savedUser.firstName,
        savedUser.lastName,
        [savedUser.email],
        otp,
      );

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async verifyUser(verifyUserPayload: VerifyUserDto) {
    try {
      const existingUser = await this.userService.getUserByEmail(
        verifyUserPayload.email,
      );

      if (!existingUser) {
        throw new NotFoundException('User with the email doesnot exists');
      }

      if (existingUser.isActive) {
        throw new BadRequestException('User already verified');
      }

      if (existingUser.otpExpiry < new Date()) {
        throw new BadRequestException('OTP Expired');
      }

      if (existingUser.otp !== verifyUserPayload.otp) {
        throw new BadRequestException('OTP doesnot match');
      }

      await this.userService.updateUser(existingUser.id, {
        isActive: true,
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }

  async resendOtp(email: string) {
    // creating query runner for transaction
    const generatedOtp = generateOTP();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updatedUserResponse = await queryRunner.manager
        .createQueryBuilder()
        .update(User)
        .set({
          otp: generateOTP,
          otpExpiry: new Date(new Date().getTime() + 5 * 60 * 1000),
        })
        .where('email = :email', { email })
        .returning('*')
        .execute();

      if (!updatedUserResponse.affected) {
        throw new NotFoundException('User with the email not found');
      }

      const updatedUser = updatedUserResponse.raw[0];

      if (updatedUser.isActive) {
        throw new BadRequestException('User already verified');
      }

      await this.emailService.sendOtp(
        updatedUser.firstName,
        updatedUser.lastName,
        [updatedUser.email],
        updatedUser.otp,
      );

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(credentials: LoginDto) {
    try {
      const existingUser = await this.userService.getUserByEmail(
        credentials.email,
      );
      if (!existingUser) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const newHashData = this.hashValue(
        credentials.password,
        existingUser.passwordSalt,
      );

      if (newHashData.hashedValue !== existingUser.password) {
        throw new BadRequestException('Invalid Credentials');
      }

      if (!existingUser.isActive) {
        throw new ForbiddenException('User not verified');
      }
      const tokens = await this.createTokens(existingUser, {
        isCompanyLogin: false,
      });

      const { password, passwordSalt, otp, ...userInfo } = existingUser;

      return { user: userInfo, tokens };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }

  async loginToCompany(userId: string, workspaceId: string) {
    try {
      const userWorkspaceRelation =
        await this.userWorkspaceRelationService.getUserWorkspaceRelation(
          userId,
          workspaceId,
        );

      const tokens = await this.createTokens(userWorkspaceRelation.user, {
        isCompanyLogin: true,
        workspace: userWorkspaceRelation.workspace,
        role: userWorkspaceRelation.role,
      });

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(resetPasswordPayload: ForgetPasswordDto) {
    try {
      const existingUser = await this.userService.getUserByEmail(
        resetPasswordPayload.email,
      );
      if (!existingUser) {
        throw new BadRequestException('Email not found');
      }

      const resetToken = this.jwtService.sign(
        { id: existingUser.id, email: existingUser.email },
        {
          secret: globalConfig().AUTH.JWT_SECRET,
          expiresIn: '5m',
        },
      );
      const resetTokenLink = `${globalConfig().FRONTEND_URL}/reset-password/${resetToken}`;
      await this.emailService.sendResetEmail(
        existingUser.firstName,
        existingUser.lastName,
        [existingUser.email],
        resetTokenLink,
      );

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }

  async resetPassword(
    resetPasswordPayload: ResetPasswordDto,
    resetToken: string,
  ) {
    try {
      const decodedData = this.jwtService.verify(resetToken, {
        secret: globalConfig().AUTH.JWT_SECRET,
      });

      const hashedPasswordData = this.hashValue(resetPasswordPayload.password);

      const updatedData = await this.userService.updateUser(decodedData.id, {
        password: hashedPasswordData.hashedValue,
        passwordSalt: hashedPasswordData.salt,
        isActive: true,
      });

      if (!updatedData) {
        throw new InternalServerErrorException('Something went wrong.');
      }

      return true;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new BadRequestException('The reset link is expired.');
      }
      console.log(error);
    }
  }

  async changePassword(
    changePasswordPayload: ChangePasswordDto,
    user: UserInterface,
  ) {
    try {
      const oldHashedPasswordData = this.hashValue(
        changePasswordPayload.password,
        user.passwordSalt,
      );

      if (oldHashedPasswordData.hashedValue !== user.password) {
        throw new BadRequestException("Old Password didn't match");
      }

      const hashedPasswordData = this.hashValue(
        changePasswordPayload.newPassword,
      );

      await this.userService.updateUser(user.id, {
        password: hashedPasswordData.hashedValue,
        passwordSalt: hashedPasswordData.salt,
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw error;
    }
  }
}
