import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto, UpdatePetDto, PetQueryDto } from './dto/pet.dto';

/**
 * 宠物管理控制器
 * 提供宠物的增删改查接口
 *
 * API 列表:
 * - GET    /pets              - 获取宠物列表（支持分页和筛选）
 * - GET    /pets/stats        - 获取宠物统计信息
 * - GET    /pets/:id          - 获取宠物详情
 * - POST   /pets              - 创建新宠物
 * - PATCH  /pets/:id          - 更新宠物信息
 * - DELETE /pets/:id          - 删除宠物
 * - POST   /pets/:id/favorite - 收藏宠物
 * - DELETE /pets/:id/favorite - 取消收藏
 */
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  /**
   * 创建新宠物
   * POST /pets
   *
   * @param createPetDto - 创建宠物的数据对象
   * @returns 创建后的宠物信息
   *
   * 请求示例:
   * {
   *   "name": "小白",
   *   "type": "dog",
   *   "breed": "金毛",
   *   "age": 2,
   *   "gender": "male",
   *   "healthStatus": "healthy",
   *   "adoptionStatus": "available"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  /**
   * 获取宠物列表
   * GET /pets
   *
   * 支持多种筛选条件和分页:
   * - type: 宠物类型 (dog/cat/rabbit/bird/hamster/other)
   * - gender: 性别 (male/female)
   * - healthStatus: 健康状况 (healthy/treating/recovered/critical)
   * - adoptionStatus: 领养状态 (available/pending/adopted/unavailable)
   * - location: 所在地（模糊搜索）
   * - page: 页码，默认1
   * - limit: 每页数量，默认10，最大100
   *
   * @param query - 查询参数
   * @returns 分页后的宠物列表和总数
   *
   * 响应示例:
   * {
   *   "data": [...],
   *   "total": 100,
   *   "page": 1,
   *   "limit": 10,
   *   "totalPages": 10
   * }
   */
  @Get()
  findAll(@Query() query: PetQueryDto) {
    return this.petsService.findAll(query);
  }

  /**
   * 获取宠物统计信息
   * GET /pets/stats
   *
   * @returns 宠物统计数据
   *
   * 响应示例:
   * {
   *   "total": 100,        // 宠物总数
   *   "available": 50,     // 可领养数量
   *   "adopted": 30,       // 已领养数量
   *   "treating": 10       // 治疗中数量
   * }
   */
  @Get('stats')
  getStats() {
    return this.petsService.getStats();
  }

  /**
   * 获取宠物详情
   * GET /pets/:id
   *
   * @param id - 宠物ID
   * @returns 宠物详细信息
   *
   * 注意: 调用此接口会自动增加宠物的查看次数
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }

  /**
   * 更新宠物信息
   * PATCH /pets/:id
   *
   * @param id - 宠物ID
   * @param updatePetDto - 要更新的字段
   * @returns 更新后的宠物信息
   *
   * 请求示例:
   * {
   *   "name": "小白白",     // 更新名字
   *   "healthStatus": "recovered"  // 更新健康状态
   * }
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petsService.update(id, updatePetDto);
  }

  /**
   * 删除宠物
   * DELETE /pets/:id
   *
   * @param id - 宠物ID
   * @returns 删除结果消息
   *
   * 注意: 此操作不可逆，删除后无法恢复
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.remove(id);
  }

  /**
   * 收藏宠物
   * POST /pets/:id/favorite
   *
   * @param id - 宠物ID
   * @returns 操作结果消息
   *
   * 注意: 需要用户登录后才能使用收藏功能
   */
  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  addFavorite(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.incrementFavorite(id);
  }

  /**
   * 取消收藏宠物
   * DELETE /pets/:id/favorite
   *
   * @param id - 宠物ID
   * @returns 操作结果消息
   *
   * 注意: 如果收藏数为0，则无法继续取消
   */
  @Delete(':id/favorite')
  @HttpCode(HttpStatus.OK)
  removeFavorite(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.decrementFavorite(id);
  }
}
