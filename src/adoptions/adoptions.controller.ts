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
import { AdoptionsService } from './adoptions.service';
import {
  CreateAdoptionDto,
  UpdateAdoptionDto,
  AdoptionQueryDto,
  ApproveAdoptionDto,
} from './dto/adoption.dto';

/**
 * 领养申请管理控制器
 * 提供领养申请的增删改查接口
 *
 * API 列表:
 * - GET    /adoptions              - 获取领养申请列表（支持分页和筛选）
 * - GET    /adoptions/stats        - 获取领养申请统计信息
 * - GET    /adoptions/:id          - 获取领养申请详情
 * - POST   /adoptions              - 创建新的领养申请
 * - PATCH  /adoptions/:id          - 更新领养申请信息
 * - POST   /adoptions/:id/approve  - 审核领养申请（通过/拒绝）
 * - POST   /adoptions/:id/cancel   - 取消领养申请
 * - DELETE /adoptions/:id          - 删除领养申请
 */
@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  /**
   * 创建领养申请
   * POST /adoptions
   *
   * 申请人提交领养申请时调用
   * 创建成功后，申请状态默认为 'pending'（待审核）
   *
   * @param createAdoptionDto - 创建申请的数据对象
   * @returns 创建后的申请信息
   *
   * 请求示例:
   * {
   *   "petId": 1,
   *   "petName": "小白",
   *   "applicantName": "张三",
   *   "applicantPhone": "13800138000",
   *   "applicantEmail": "zhangsan@example.com",
   *   "applicantIdCard": "110101199001011234",
   *   "applicantAddress": "北京市朝阳区xxx",
   *   "experience": "有养狗经验",
   *   "housingType": "公寓",
   *   "hasYard": false,
   *   "familyMembers": 3,
   *   "workHours": "9:00-18:00"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAdoptionDto: CreateAdoptionDto) {
    return this.adoptionsService.create(createAdoptionDto);
  }

  /**
   * 获取领养申请列表
   * GET /adoptions
   *
   * 支持多种筛选条件和分页:
   * - status: 申请状态 (pending/approved/rejected/cancelled)
   * - applicantName: 申请人姓名（模糊搜索）
   * - petName: 宠物姓名（模糊搜索）
   * - page: 页码，默认1
   * - limit: 每页数量，默认10，最大100
   *
   * @param query - 查询参数
   * @returns 分页后的申请列表和总数
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
  findAll(@Query() query: AdoptionQueryDto) {
    return this.adoptionsService.findAll(query);
  }

  /**
   * 获取领养申请统计信息
   * GET /adoptions/stats
   *
   * @returns 申请统计数据
   *
   * 响应示例:
   * {
   *   "total": 100,       // 申请总数
   *   "pending": 30,      // 待审核数量
   *   "approved": 50,     // 已通过数量
   *   "rejected": 20      // 已拒绝数量
   * }
   */
  @Get('stats')
  getStats() {
    return this.adoptionsService.getStats();
  }

  /**
   * 获取领养申请详情
   * GET /adoptions/:id
   *
   * @param id - 申请ID
   * @returns 申请详细信息
   *
   * 响应包含:
   * - 申请人信息（姓名、电话、邮箱、身份证、地址）
   * - 申请宠物信息（ID、名称）
   * - 审核信息（状态、审核人、审核日期、拒绝原因等）
   * - 家庭情况（住房类型、是否有院子、家庭成员数、工作时间）
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adoptionsService.findOne(id);
  }

  /**
   * 更新领养申请信息
   * PATCH /adoptions/:id
   *
   * 仅允许修改待审核（pending）状态的申请
   *
   * @param id - 申请ID
   * @param updateAdoptionDto - 要更新的字段
   * @returns 更新后的申请信息
   *
   * 限制:
   * - 已审核通过的申请无法修改
   * - 已拒绝的申请无法修改
   * - 已取消的申请无法修改
   *
   * 请求示例:
   * {
   *   "applicantPhone": "13900139000",  // 更新联系电话
   *   "applicantAddress": "新地址..."    // 更新地址
   * }
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionsService.update(id, updateAdoptionDto);
  }

  /**
   * 审核领养申请
   * POST /adoptions/:id/approve
   *
   * 管理员审核领养申请，可选择通过或拒绝
   *
   * @param id - 申请ID
   * @param approveDto - 审核结果
   * @returns 更新后的申请信息
   *
   * 审核流程:
   * 1. 如果 status = 'approved':
   *    - 设置 approvalDate 为当前时间
   *    - 设置 approver 为审核人
   *    - 可选填写 remarks
   *
   * 2. 如果 status = 'rejected':
   *    - 设置 rejectionDate 为当前时间
   *    - 设置 rejecter 为审核人
   *    - 必须填写 rejectReason（拒绝原因）
   *    - 可选填写 remarks
   *
   * 请求示例（通过）:
   * {
   *   "status": "approved",
   *   "approver": "管理员",
   *   "remarks": "资料完整，符合领养条件"
   * }
   *
   * 请求示例（拒绝）:
   * {
   *   "status": "rejected",
   *   "rejecter": "管理员",
   *   "rejectReason": "住房条件不符合要求",
   *   "remarks": "建议改善居住环境后重新申请"
   * }
   */
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveDto: ApproveAdoptionDto,
  ) {
    return this.adoptionsService.approve(id, approveDto);
  }

  /**
   * 取消领养申请
   * POST /adoptions/:id/cancel
   *
   * 申请人可以取消自己提交的领养申请
   * 仅允许取消待审核（pending）状态的申请
   *
   * @param id - 申请ID
   * @returns 取消结果消息
   *
   * 限制:
   * - 已审核通过的申请无法取消
   * - 已拒绝的申请无法取消
   * - 只能由申请人自己取消
   */
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.adoptionsService.cancel(id);
  }

  /**
   * 删除领养申请
   * DELETE /adoptions/:id
   *
   * 从数据库中永久删除领养申请记录
   *
   * @param id - 申请ID
   * @returns 删除结果消息
   *
   * 注意:
   * - 此操作不可逆，删除后无法恢复
   * - 建议使用 cancel 接口取消申请，而非直接删除
   * - 管理员可以删除任何状态的申请
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adoptionsService.remove(id);
  }
}
