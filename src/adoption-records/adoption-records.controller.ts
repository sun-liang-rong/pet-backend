import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdoptionRecordsService } from './adoption-records.service';
import {
  AdoptionRecordQueryDto,
  CreateAdoptionRecordDto,
  UpdateAdoptionRecordDto,
  AddFollowUpDto,
} from './dto/adoption-record.dto';

/**
 * 领养记录管理控制器
 * 提供领养记录的增删改查接口
 *
 * API 列表:
 * - GET    /adoption-records              - 获取领养记录列表（支持分页和筛选）
 * - GET    /adoption-records/stats        - 获取领养记录统计
 * - GET    /adoption-records/:id          - 获取领养记录详情
 * - POST   /adoption-records              - 创建新的领养记录
 * - PATCH  /adoption-records/:id          - 更新领养记录信息
 * - DELETE /adoption-records/:id          - 删除领养记录
 * - POST   /adoption-records/:id/follow-up - 添加回访记录
 */
@Controller('adoption-records')
export class AdoptionRecordsController {
  constructor(private readonly adoptionRecordsService: AdoptionRecordsService) {}

  /**
   * 创建领养记录
   * POST /adoption-records
   *
   * @param createDto - 创建数据
   * @returns 创建后的领养记录
   *
   * 请求示例:
   * {
   *   "petId": 1,
   *   "petName": "小白",
   *   "petBreed": "中华田园犬",
   *   "adopterId": 1,
   *   "adopterName": "张三",
   *   "adopterPhone": "13800138000",
   *   "adopterEmail": "zhangsan@example.com",
   *   "adoptionDate": "2023-10-24",
   *   "agreementNumber": "PA-2023-001",
   *   "remarks": "已完成领养手续"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateAdoptionRecordDto) {
    return this.adoptionRecordsService.create(createDto, '管理员');
  }

  /**
   * 获取领养记录列表
   * GET /adoption-records
   *
   * 支持多种筛选条件和分页:
   * - status: 记录状态 (active/completed/cancelled)
   * - petName: 宠物名称（模糊搜索）
   * - adopterName: 领养人姓名（模糊搜索）
   * - recordNumber: 记录编号（精确搜索）
   * - startDate/endDate: 领养日期范围
   * - page: 页码，默认1
   * - limit: 每页数量，默认10，最大100
   *
   * @param query - 查询参数
   * @returns 分页后的记录列表和总数
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
  findAll(@Query() query: AdoptionRecordQueryDto) {
    return this.adoptionRecordsService.findAll(query);
  }

  /**
   * 获取领养记录统计
   * GET /adoption-records/stats
   *
   * @returns 统计数据
   *
   * 响应示例:
   * {
   *   "total": 100,            // 记录总数
   *   "active": 80,            // 进行中数量
   *   "completed": 15,         // 已完成数量
   *   "cancelled": 5,          // 已取消数量
   *   "pendingFollowUp": 10    // 待回访数量
   * }
   */
  @Get('stats')
  getStats() {
    return this.adoptionRecordsService.getStats();
  }

  /**
   * 获取领养记录详情
   * GET /adoption-records/:id
   *
   * @param id - 记录ID
   * @returns 记录详细信息
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionRecordsService.findOne(id);
  }

  /**
   * 更新领养记录
   * PATCH /adoption-records/:id
   *
   * @param id - 记录ID
   * @param updateDto - 要更新的字段
   * @returns 更新后的记录
   *
   * 请求示例:
   * {
   *   "status": "completed",
   *   "adopterPhone": "13900139000",
   *   "remarks": "已回访，一切正常"
   * }
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAdoptionRecordDto,
  ) {
    return this.adoptionRecordsService.update(id, updateDto, '管理员');
  }

  /**
   * 删除领养记录
   * DELETE /adoption-records/:id
   *
   * @param id - 记录ID
   * @returns 删除结果消息
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.adoptionRecordsService.remove(id);
  }

  /**
   * 添加回访记录
   * POST /adoption-records/:id/follow-up
   *
   * @param id - 记录ID
   * @param followUpDto - 回访数据
   * @returns 更新后的记录
   *
   * 请求示例:
   * {
   *   "content": "宠物健康状况良好，已完成疫苗接种。",
   *   "operator": "李医生",
   *   "nextFollowUpDate": "2024-01-24"
   * }
   */
  @Post(':id/follow-up')
  @HttpCode(HttpStatus.OK)
  addFollowUp(
    @Param('id') id: string,
    @Body() followUpDto: AddFollowUpDto,
  ) {
    return this.adoptionRecordsService.addFollowUp(id, followUpDto, '管理员');
  }
}
