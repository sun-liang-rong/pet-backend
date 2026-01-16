/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/require-await */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      return null;
    }

    // 检查密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(
      '验证结果:',
      isPasswordValid,
      '输入密码:',
      password,
      '存储密码:',
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    // 检查用户状态
    if (user.status !== 'active') {
      throw new UnauthorizedException('用户已被禁用');
    }

    return user;
  }

  async login(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    console.log(this.configService.get('JWT_EXPIRES_IN'), 'JWT_EXPIRES_IN');
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '1d'), // 或 '1d' / '3600s'
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async register(registerDto: {
    username: string;
    password: string;
    realName: string;
    role?: 'admin' | 'staff' | 'volunteer';
    phone?: string;
    email?: string;
  }) {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new UnauthorizedException('用户名已存在');
    }

    // 哈希密码
    const hashedPassword = await this.hashPassword(registerDto.password);

    // 创建用户
    const user = this.userRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      realName: registerDto.realName,
      role: registerDto.role || 'staff',
      phone: registerDto.phone,
      email: registerDto.email,
      status: 'active',
    });

    const savedUser = await this.userRepository.save(user);

    // 返回用户信息（不包含密码）
    return {
      id: savedUser.id,
      username: savedUser.username,
      realName: savedUser.realName,
      role: savedUser.role,
      phone: savedUser.phone,
      email: savedUser.email,
      avatar: savedUser.avatar,
      createTime: savedUser.createTime,
      status: savedUser.status,
    };
  }
}
