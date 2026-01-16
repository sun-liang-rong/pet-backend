import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'staff',
      status: 'active',
    });

    const savedUser = await this.userRepository.save(user);
    // 不返回密码
    const { password, ...result } = savedUser;
    return result;
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, pageSize, search, role } = query;
    const actualLimit = pageSize || limit;
    const skip = (page - 1) * actualLimit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 应用过滤条件
    if (search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.realName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // 排序：最新创建的优先
    queryBuilder.orderBy('user.createTime', 'DESC');

    // 分页
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // 不返回密码
    const usersWithoutPassword = users.map((user) => {
      const { password, ...result } = user;
      return result;
    });

    return {
      data: usersWithoutPassword,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 不返回密码
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 如果更新密码，需要加密
    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    await this.userRepository.update(id, updateData);

    // 返回更新后的用户（不含密码）
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    await this.userRepository.remove(user);
    return { message: '用户删除成功' };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getStats() {
    const total = await this.userRepository.count();
    const active = await this.userRepository.count({
      where: { status: 'active' },
    });
    const inactive = await this.userRepository.count({
      where: { status: 'inactive' },
    });
    const locked = await this.userRepository.count({
      where: { status: 'locked' },
    });
    const admin = await this.userRepository.count({
      where: { role: 'admin' },
    });
    const staff = await this.userRepository.count({
      where: { role: 'staff' },
    });
    const volunteer = await this.userRepository.count({
      where: { role: 'volunteer' },
    });

    return {
      total,
      active,
      inactive,
      locked,
      admin,
      staff,
      volunteer,
    };
  }

  /**
   * 冻结用户
   * POST /users/:id/freeze
   */
  async freeze(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.userRepository.update(id, { status: 'locked' });
    const updatedUser = await this.userRepository.findOneOrFail({ where: { id } });
    const { password, ...result } = updatedUser;
    return result;
  }

  /**
   * 解冻用户
   * POST /users/:id/unfreeze
   */
  async unfreeze(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.userRepository.update(id, { status: 'active' });
    const updatedUser = await this.userRepository.findOneOrFail({ where: { id } });
    const { password, ...result } = updatedUser;
    return result;
  }

  /**
   * 重置用户密码
   * POST /users/:id/reset-password
   */
  async resetPassword(id: number, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.userRepository.update(id, { password: hashedPassword });

    return { message: '密码重置成功' };
  }

  /**
   * 根据ID查找用户（不隐藏密码，供内部使用）
   */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
