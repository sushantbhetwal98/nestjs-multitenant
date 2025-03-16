import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUserDetail } from 'common/decorator/getUserDetail.decorator';
import { AuthGuard } from 'common/guards/auth.guard';
import { UserInterface } from '../user/interface/user.interface';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { GetUser } from 'common/decorator/getUser.decorator';
import { UserInfoInterface } from '../user/interface/userInfo.interface';
import { RefreshGuard } from 'common/guards/refresh.guard';
import { GetWorkpsace } from 'common/decorator/getWorkspace.decorator';
import { WorkspaceInterface } from '../workspace/interface/workspace.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() registerUserPayload: RegisterUserDto) {
    return {
      data: await this.authService.createUser(registerUserPayload),
      message: 'User Registered Successfully.',
    };
  }

  @Patch('/verify')
  async verifyUser(@Body() verifyOtpPayload: VerifyUserDto) {
    const data = await this.authService.verifyUser(verifyOtpPayload);
    return {
      data,
      message: 'User Verified Successfully.',
    };
  }

  @Patch('/resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    const data = await this.authService.resendOtp(body.email);
    return {
      data,
      message: 'OTP resend to your email.',
    };
  }

  @Post('/login')
  async login(@Body() credentialsPayload: LoginDto) {
    return {
      ...(await this.authService.login(credentialsPayload)),
      message: 'Login Successful',
    };
  }

  @UseGuards(AuthGuard)
  @Post('/workspace-login/:workspaceId')
  async loginToWorkspace(
    @GetUser() user: UserInfoInterface,
    @Param('workspaceId') workspaceId: string,
  ) {
    return {
      ...(await this.authService.loginToWorkspace(user.id, workspaceId)),
      message: 'Login To workspace Successful',
    };
  }

  @Post('/forget-password')
  async forgetPassword(@Body() resetPasswordPayload: ForgetPasswordDto) {
    return {
      data: await this.authService.forgetPassword(resetPasswordPayload),
      message: 'Reset instruction send to the email',
    };
  }

  @Patch('/reset-password/:resetToken')
  async resetPassword(
    @Body() resetPasswordPayload: ResetPasswordDto,
    @Param('resetToken') resetToken: string,
  ) {
    return {
      data: await this.authService.resetPassword(
        resetPasswordPayload,
        resetToken,
      ),
      message: 'Password reset successfully.',
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordPayload: ChangePasswordDto,
    @GetUserDetail() user: UserInterface,
  ) {
    return {
      data: await this.authService.changePassword(changePasswordPayload, user),
      message: 'Password changed successfully',
    };
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(
    @GetUserDetail() user: UserInterface,
    @GetWorkpsace() workspace: WorkspaceInterface | null,
  ) {
    return {
      ...(await this.authService.refresh(user, workspace)),
      message: 'Token refreshed successfully.',
    };
  }
}
