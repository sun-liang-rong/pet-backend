import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { username: string; password: string }) {
    console.log('登录请求:', loginDto);
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      console.log('用户验证失败');
      throw new UnauthorizedException('用户名或密码错误');
    }

    console.log('用户验证成功:', user);
    const result = this.authService.login(user);
    console.log('登录结果:', result);
    return result;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    registerDto: {
      username: string;
      password: string;
      realName: string;
      role?: 'admin' | 'staff' | 'volunteer';
      phone?: string;
      email?: string;
    },
  ) {
    return this.authService.register(registerDto);
  }
}
