import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'common/guards/auth.guard';
import { UpdateUserDto } from './dto/users.dto';
import { GetUser } from 'common/decorator/getUser.decorator';
import { UserInfoInterface } from './interface/userInfo.interface';

@UseGuards(AuthGuard)
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    const { password, passwordSalt, otp, otpExpiry, ...data } =
      await this.userService.getUserByEmail(email);
    return {
      ...data,
      message: 'User fetched successfully.',
    };
  }

  @Get('/me')
  getMyProfile(@GetUser() user: UserInfoInterface) {
    return {
      ...user,
      message: 'Profile Fetched successfully',
    };
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: string) {
    const { password, passwordSalt, otp, otpExpiry, ...data } =
      await this.userService.getUserById(userId);
    return {
      ...data,
      message: 'User fetched successfully.',
    };
  }

  @Patch('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserPayload: UpdateUserDto,
  ) {
    return {
      data: await this.userService.updateUser(userId, updateUserPayload),
      message: 'User updated successfully.',
    };
  }
}
