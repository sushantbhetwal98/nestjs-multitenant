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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() registerUserPayload: RegisterUserDto) {
    const data = await this.authService.createUser(registerUserPayload);
    return {
      data,
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
    const data = await this.authService.login(credentialsPayload);
    return {
      data,
      message: 'Login Successful',
    };
  }

  @Post('/forget-password')
  async forgetPassword(@Body() resetPasswordPayload: ForgetPasswordDto) {
    const data = await this.authService.forgetPassword(resetPasswordPayload);
    return {
      data,
      message: 'Reset instruction send to the email',
    };
  }

  @Patch('/reset-password/:resetToken')
  async resetPassword(
    @Body() resetPasswordPayload: ResetPasswordDto,
    @Param('resetToken') resetToken: string,
  ) {
    const data = await this.authService.resetPassword(
      resetPasswordPayload,
      resetToken,
    );
    return {
      data,
      message: 'Password reset successfully.',
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordPayload: ChangePasswordDto,
    @GetUserDetail() user: UserInterface,
  ) {
    const data = await this.authService.changePassword(
      changePasswordPayload,
      user,
    );
    return {
      data,
      message: 'Password changed successfully',
    };
  }
}
