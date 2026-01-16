import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto, UpdatePetDto, PetQueryDto } from './dto/pet.dto';

/**
 * 宠物服务层
 * 负责处理宠物相关的业务逻辑
 */
@Injectable()
export class PetsService {
  /**
   * 构造函数，注入宠物实体仓库
   *
   * @param petRepository - 宠物实体的 TypeORM 仓库实例
   */
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  /**
   * 创建新宠物
   *
   * 此方法会:
   * 1. 创建宠物实体并设置默认值
   * 2. 初始化查看次数和收藏次数为0
   * 3. 默认健康状况为 'healthy'
   * 4. 默认领养状态为 'available'
   * 5. 保存到数据库
   *
   * @param createPetDto - 创建宠物的数据对象
   * @returns 保存后的宠物实体
   *
   * 默认值设置:
   * - viewCount: 0 (查看次数)
   * - favoriteCount: 0 (收藏次数)
   * - healthStatus: 'healthy' (健康状况)
   * - adoptionStatus: 'available' (领养状态)
   */
  async create(createPetDto: CreatePetDto) {
    // 创建宠物实体，设置默认值
    const pet = this.petRepository.create({
      ...createPetDto,
      viewCount: 0,
      favoriteCount: 0,
      // 如果前端未提供健康状况，默认设为 'healthy'
      healthStatus: createPetDto.healthStatus || 'healthy',
      // 如果前端未提供领养状态，默认设为 'available'
      adoptionStatus: createPetDto.adoptionStatus || 'available',
    });

    // 保存到数据库
    const savedPet = await this.petRepository.save(pet);
    return savedPet;
  }

  /**
   * 获取宠物列表
   *
   * 支持多条件筛选和分页查询:
   * - 按宠物类型筛选 (type)
   * - 按性别筛选 (gender)
   * - 按健康状况筛选 (healthStatus)
   * - 按领养状态筛选 (adoptionStatus)
   * - 按所在地模糊搜索 (location)
   * - 分页查询 (page, limit)
   *
   * 排序规则: 按创建时间倒序排列，最新创建的在前
   *
   * @param query - 查询参数对象
   * @returns 分页结果，包含数据列表和分页信息
   *
   * 返回数据结构:
   * {
   *   data: [...],      // 宠物数据数组
   *   total: number,    // 总记录数
   *   page: number,     // 当前页码
   *   limit: number,    // 每页数量
   *   totalPages: number // 总页数
   * }
   */
  async findAll(query: PetQueryDto) {
    // 解构查询参数，设置默认值
    const { page = 1, limit = 10, ...filters } = query;
    // 计算跳过的记录数
    const skip = (page - 1) * limit;

    // 创建查询构建器
    const queryBuilder = this.petRepository.createQueryBuilder('pet');

    // === 筛选条件 ===

    // 按宠物类型筛选 (精确匹配)
    if (filters.type) {
      queryBuilder.andWhere('pet.type = :type', { type: filters.type });
    }

    // 按性别筛选 (精确匹配)
    if (filters.gender) {
      queryBuilder.andWhere('pet.gender = :gender', { gender: filters.gender });
    }

    // 按健康状况筛选 (精确匹配)
    if (filters.healthStatus) {
      queryBuilder.andWhere('pet.healthStatus = :healthStatus', {
        healthStatus: filters.healthStatus,
      });
    }

    // 按领养状态筛选 (精确匹配)
    if (filters.adoptionStatus) {
      queryBuilder.andWhere('pet.adoptionStatus = :adoptionStatus', {
        adoptionStatus: filters.adoptionStatus,
      });
    }

    // 按所在地模糊搜索 (LIKE 查询)
    if (filters.location) {
      queryBuilder.andWhere('pet.location LIKE :location', {
        location: `%${filters.location}%`,
      });
    }

    // === 排序 ===
    // 按创建时间倒序，最新创建的在前
    queryBuilder.orderBy('pet.createTime', 'DESC');

    // === 分页 ===
    queryBuilder.skip(skip).take(limit);

    // 执行查询，获取数据和总数
    const [pets, total] = await queryBuilder.getManyAndCount();

    // 返回分页结果
    return {
      data: pets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取宠物详情
   *
   * 根据ID获取宠物的详细信息
   * 调用此方法会自动增加宠物的查看次数
   *
   * @param id - 宠物ID
   * @returns 宠物详细信息
   *
   * @throws NotFoundException - 如果宠物不存在
   */
  async findOne(id: number) {
    // 查询宠物
    const pet = await this.petRepository.findOne({
      where: { id },
    });

    // 如果宠物不存在，抛出异常
    if (!pet) {
      throw new NotFoundException(`ID 为 ${id} 的宠物不存在`);
    }

    // 增加查看次数
    await this.petRepository.increment({ id }, 'viewCount', 1);

    return pet;
  }

  /**
   * 更新宠物信息
   *
   * 部分更新，允许只更新传入的字段
   *
   * @param id - 宠物ID
   * @param updatePetDto - 要更新的字段
   * @returns 更新后的宠物信息
   *
   * @throws NotFoundException - 如果宠物不存在
   *
   * 注意:
   * - 只更新传入的字段，未传入的字段保持不变
   * - 会自动更新 updateTime 字段
   */
  async update(id: number, updatePetDto: UpdatePetDto) {
    // 先获取原宠物信息
    const pet = await this.findOne(id);

    // 合并更新数据，并设置更新时间
    const updatedPet = await this.petRepository.save({
      ...pet,
      ...updatePetDto,
      updateTime: new Date(),
    });

    return updatedPet;
  }

  /**
   * 删除宠物
   *
   * 从数据库中永久删除宠物记录
   *
   * @param id - 宠物ID
   * @returns 删除结果消息
   *
   * @throws NotFoundException - 如果宠物不存在
   *
   * 注意: 此操作不可逆，删除后无法恢复
   */
  async remove(id: number) {
    // 先获取宠物信息，确保存在
    const pet = await this.findOne(id);

    // 从数据库中删除
    await this.petRepository.remove(pet);

    // 返回成功消息
    return { message: '宠物删除成功', id };
  }

  /**
   * 收藏宠物
   *
   * 将宠物的收藏数加1
   *
   * @param id - 宠物ID
   * @returns 操作结果消息
   */
  async incrementFavorite(id: number) {
    // 收藏数加1
    await this.petRepository.increment({ id }, 'favoriteCount', 1);
    return { message: '收藏成功' };
  }

  /**
   * 取消收藏宠物
   *
   * 将宠物的收藏数减1
   * 如果收藏数已经为0，则不会继续减少
   *
   * @param id - 宠物ID
   * @returns 操作结果消息
   *
   * 注意: 只有当收藏数大于0时才会减少
   */
  async decrementFavorite(id: number) {
    // 先获取宠物信息
    const pet = await this.findOne(id);

    // 只有收藏数大于0时才减少
    if (pet.favoriteCount > 0) {
      await this.petRepository.decrement({ id }, 'favoriteCount', 1);
    }

    return { message: '取消收藏成功' };
  }

  /**
   * 获取宠物统计信息
   *
   * 统计宠物的数量分布:
   * - 总数 (total)
   * - 可领养数量 (available)
   * - 已领养数量 (adopted)
   * - 治疗中数量 (treating)
   *
   * @returns 统计数据对象
   *
   * 响应示例:
   * {
   *   "total": 100,        // 宠物总数
   *   "available": 50,     // 可领养数量
   *   "adopted": 30,       // 已领养数量
   *   "treating": 10       // 治疗中数量
   * }
   */
  async getStats() {
    // 并行执行多个计数查询，提高性能
    const [total, available, adopted, treating] = await Promise.all([
      this.petRepository.count(), // 总数
      this.petRepository.count({
        where: { adoptionStatus: 'available' }, // 可领养
      }),
      this.petRepository.count({
        where: { adoptionStatus: 'adopted' }, // 已领养
      }),
      this.petRepository.count({
        where: { healthStatus: 'treating' }, // 治疗中
      }),
    ]);

    return {
      total,
      available,
      adopted,
      treating,
    };
  }
}
