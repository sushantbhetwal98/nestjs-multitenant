import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import globalConfig from 'config/global.config';
import { UserWorkspaceRelationService } from 'src/modules/public/user-workspace-relation/userWorkspaceRelation.service';
import { UserService } from 'src/modules/public/user/user.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userWorkspaceRelationService: UserWorkspaceRelationService,
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
    if (!accessToken || bearer !== 'Refresh') {
      throw new UnauthorizedException(
        'Please provide a valid authorization token',
      );
    }

    try {
      const decodedToken = this.jwtService.verify(accessToken, {
        secret: globalConfig().AUTH.JWT_REFRESH_TOKEN_SECRET,
      });

      const isWorkspaceLoginRefresh: boolean = decodedToken.workspaceId;

      if (isWorkspaceLoginRefresh) {
        const userWorkspaceRelation =
          await this.userWorkspaceRelationService.getUserWorkspaceRelation(
            decodedToken.userId,
            decodedToken.workspaceId,
          );
        const { password, passwordSalt, otp, otpExpiry, ...userInfo } =
          userWorkspaceRelation.user;
        request['workspaceDetail'] = userWorkspaceRelation.workspace;
        request['userDetail'] = userWorkspaceRelation.user;
        request['userInfo'] = userInfo;
      } else {
        const userDetail = await this.userService.getUserById(decodedToken.id);
        const { password, passwordSalt, otp, otpExpiry, ...userInfo } =
          userDetail;
        request['userDetail'] = userDetail;
        request['userInfo'] = userInfo;
        request['workspaceDetail'] = null;
      }

      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      console.error(error);
    }
  }
}
