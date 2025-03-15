import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import globalConfig from 'config/global.config';
import { UserService } from 'src/modules/public/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (
      !request.headers['Authorization']?.split(' ') &&
      !request.headers['authorization']?.split(' ')
    ) {
      throw new UnauthorizedException('Please Provide an authorization token');
    }

    const [bearer, accessToken] =
      request.headers['Authorization']?.split(' ') ||
      request.headers['authorization']?.split(' ');
    if (!accessToken || bearer !== 'Bearer') {
      throw new UnauthorizedException(
        'Please provide a valid authorization token',
      );
    }

    try {
      const decodedToken = this.jwtService.verify(accessToken, {
        secret: globalConfig().AUTH.JWT_ACCESS_TOKEN_SECRET,
      });

      const userDetail = await this.userService.getUserById(decodedToken.id);
      const { password, passwordSalt, otp, otpExpiry, ...userInfo } =
        userDetail;
      request['userDetail'] = userDetail;
      request['userInfo'] = userInfo;

      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      console.error(error);
    }
  }
}
