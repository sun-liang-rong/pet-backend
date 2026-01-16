/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 检查是否跳过认证
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log(user);
      if (info && typeof info === 'object' && info.name) {
        if (info.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token已过期');
        }
        if (info.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('无效的Token');
        }
      }
      throw err || new UnauthorizedException('认证失败');
    }
    return user;
  }
}
