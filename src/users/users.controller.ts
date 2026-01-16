import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto, ResetPasswordDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 创建用户
   * POST /users
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * 获取用户列表
   * GET /users
   */
  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  /**
   * 获取用户统计
   * GET /users/stats
   */
  @Get('stats')
  getStats() {
    return this.usersService.getStats();
  }

  /**
   * 获取当前登录用户信息
   * GET /users/me
   */
  @Get('me')
  getProfile(@Request() req: any) {
    // req.user 来自 JWT 策略
    const userId = req.user?.userId || req.user?.id || req.user?.sub;
    return this.usersService.findOne(userId);
  }

  /**
   * 获取单个用户
   * GET /users/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * 更新用户
   * PUT /users/:id
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * 冻结用户
   * POST /users/:id/freeze
   */
  @Post(':id/freeze')
  freeze(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.freeze(id);
  }

  /**
   * 解冻用户
   * POST /users/:id/unfreeze
   */
  @Post(':id/unfreeze')
  unfreeze(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unfreeze(id);
  }

  /**
   * 重置用户密码
   * POST /users/:id/reset-password
   */
  @Post(':id/reset-password')
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(id, resetPasswordDto.newPassword);
  }

  /**
   * 删除用户
   * DELETE /users/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
