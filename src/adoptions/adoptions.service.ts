import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adoption } from '../entities/adoption.entity';
import {
  CreateAdoptionDto,
  UpdateAdoptionDto,
  AdoptionQueryDto,
  ApproveAdoptionDto,
} from './dto/adoption.dto';

/**
 * 领养申请服务层
 * 负责处理领养申请相关的业务逻辑
 */
@Injectable()
export class AdoptionsService {
  /**
   * 构造函数，注入领养申请实体仓库
   *
   * @param adoptionRepository - 领养申请实体的 TypeORM 仓库实例
   */
  constructor(
    @InjectRepository(Adoption)
    private readonly adoptionRepository: Repository<Adoption>,
  ) {}

  /**
   * 创建领养申请
   *
   * 当用户提交领养申请时调用此方法
   * 创建时会设置默认值:
   * - status: 'pending' (待审核)
   * - applicationDate: 当前时间
   *
   * @param createAdoptionDto - 创建申请的数据对象
   * @returns 保存后的申请实体
   *
   * 字段说明:
   * - petId: 要领养的宠物ID
   * - petName: 宠物名称（冗余存储，便于查询）
   * - applicantName: 申请人姓名
   * - applicantPhone: 联系电话
   * - applicantEmail: 电子邮箱
   * - applicantIdCard: 身份证号
   * - applicantAddress: 居住地址
   * - experience: 养宠经验
   * - housingType: 住房类型
   * - hasYard: 是否有院子
   * - familyMembers: 家庭成员数
   * - workHours: 工作时间
   */
  async create(createAdoptionDto: CreateAdoptionDto) {
    // 创建申请实体，设置默认值
    const adoption = this.adoptionRepository.create({
      ...createAdoptionDto,
      // 默认状态为待审核
      status: 'pending',
      // 设置申请日期为当前时间
      applicationDate: new Date(),
    });

    // 保存到数据库
    const savedAdoption = await this.adoptionRepository.save(adoption);
    return savedAdoption;
  }

  /**
   * 获取领养申请列表
   *
   * 支持多条件筛选和分页查询:
   * - 按申请状态筛选 (pending/approved/rejected/cancelled)
   * - 按申请人姓名模糊搜索
   * - 按宠物名称模糊搜索
   * - 分页查询 (page, limit)
   *
   * 排序规则: 按申请日期倒序排列，最新申请的在前
   *
   * @param query - 查询参数对象
   * @returns 分页结果，包含申请列表和分页信息
   *
   * 返回数据结构:
   * {
   *   data: [...],      // 申请数据数组
   *   total: number,    // 总记录数
   *   page: number,     // 当前页码
   *   limit: number,    // 每页数量
   *   totalPages: number // 总页数
   * }
   */
  async findAll(query: AdoptionQueryDto) {
    // 解构查询参数，设置默认值
    const { page = 1, limit = 10, ...filters } = query;
    // 计算跳过的记录数
    const skip = (page - 1) * limit;

    // 创建查询构建器
    const queryBuilder = this.adoptionRepository.createQueryBuilder('adoption');

    // === 筛选条件 ===

    // 按申请状态筛选（精确匹配）
    if (filters.status) {
      queryBuilder.andWhere('adoption.status = :status', {
        status: filters.status,
      });
    }

    // 按申请人姓名模糊搜索
    if (filters.applicantName) {
      queryBuilder.andWhere('adoption.applicantName LIKE :applicantName', {
        applicantName: `%${filters.applicantName}%`,
      });
    }

    // 按宠物名称模糊搜索
    if (filters.petName) {
      queryBuilder.andWhere('adoption.petName LIKE :petName', {
        petName: `%${filters.petName}%`,
      });
    }

    // === 排序 ===
    // 按申请日期倒序，最新申请的在前
    queryBuilder.orderBy('adoption.applicationDate', 'DESC');

    // === 分页 ===
    queryBuilder.skip(skip).take(limit);

    // 执行查询，获取数据和总数
    const [adoptions, total] = await queryBuilder.getManyAndCount();

    // 返回分页结果
    return {
      data: adoptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取领养申请详情
   *
   * 根据ID获取申请的详细信息
   *
   * @param id - 申请ID
   * @returns 申请详细信息
   *
   * @throws NotFoundException - 如果申请不存在
   */
  async findOne(id: number) {
    // 查询申请
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
    });

    // 如果申请不存在，抛出异常
    if (!adoption) {
      throw new NotFoundException(`ID 为 ${id} 的领养申请不存在`);
    }

    return adoption;
  }

  /**
   * 更新领养申请信息
   *
   * 部分更新，允许只更新传入的字段
   * 限制: 只能修改待审核状态的申请
   *
   * @param id - 申请ID
   * @param updateAdoptionDto - 要更新的字段
   * @returns 更新后的申请信息
   *
   * @throws NotFoundException - 如果申请不存在
   * @throws BadRequestException - 如果申请状态不是待审核
   *
   * 注意:
   * - 只更新传入的字段，未传入的字段保持不变
   * - 会自动更新 updateTime 字段
   */
  async update(id: number, updateAdoptionDto: UpdateAdoptionDto) {
    // 先获取原申请信息
    const adoption = await this.findOne(id);

    // 检查状态是否为待审核
    if (adoption.status !== 'pending') {
      throw new BadRequestException('只能修改待审核的申请');
    }

    // 合并更新数据，并设置更新时间
    const updatedAdoption = await this.adoptionRepository.save({
      ...adoption,
      ...updateAdoptionDto,
      updateTime: new Date(),
    });

    return updatedAdoption;
  }

  /**
   * 审核领养申请
   *
   * 管理员审核领养申请，可以选择通过或拒绝
   *
   * @param id - 申请ID
   * @param approveDto - 审核结果数据
   * @returns 更新后的申请信息
   *
   * @throws NotFoundException - 如果申请不存在
   * @throws BadRequestException - 如果申请状态不是待审核
   *
   * 审核逻辑:
   *
   * 1. 通过申请 (status = 'approved'):
   *    - 设置 status 为 'approved'
   *    - 设置 approvalDate 为当前时间
   *    - 设置 approver 为审核人
   *    - 可选记录 remarks
   *
   * 2. 拒绝申请 (status = 'rejected'):
   *    - 设置 status 为 'rejected'
   *    - 设置 rejectionDate 为当前时间
   *    - 设置 rejecter 为审核人
   *    - 必须提供 rejectReason（拒绝原因）
   *    - 可选记录 remarks
   */
  async approve(id: number, approveDto: ApproveAdoptionDto) {
    // 先获取申请信息
    const adoption = await this.findOne(id);

    // 检查状态是否为待审核
    if (adoption.status !== 'pending') {
      throw new BadRequestException('只能审核待处理的申请');
    }

    const now = new Date();
    const updateData: Partial<Adoption> = {
      status: approveDto.status,
      updateTime: now,
    };

    // 如果审核通过
    if (approveDto.status === 'approved') {
      updateData.approvalDate = now;
      updateData.approver = approveDto.approver || 'admin';
      updateData.remarks = approveDto.remarks;
    }
    // 如果审核拒绝
    else if (approveDto.status === 'rejected') {
      updateData.rejectionDate = now;
      updateData.rejecter = approveDto.rejecter || 'admin';
      updateData.rejectReason = approveDto.rejectReason;
      updateData.remarks = approveDto.remarks;
    }

    // 保存更新
    const updatedAdoption = await this.adoptionRepository.save({
      ...adoption,
      ...updateData,
    });

    return updatedAdoption;
  }

  /**
   * 取消领养申请
   *
   * 申请人可以取消自己提交的领养申请
   * 限制: 只能取消待审核状态的申请
   *
   * @param id - 申请ID
   * @returns 取消结果消息
   *
   * @throws NotFoundException - 如果申请不存在
   * @throws BadRequestException - 如果申请状态不是待审核
   *
   * 注意:
   * - 取消后申请状态变为 'cancelled'
   * - 此操作不可逆，取消后无法恢复
   */
  async cancel(id: number) {
    // 先获取申请信息
    const adoption = await this.findOne(id);

    // 检查状态是否为待审核
    if (adoption.status !== 'pending') {
      throw new BadRequestException('只能取消待审核的申请');
    }

    // 更新状态为已取消
    await this.adoptionRepository.save({
      ...adoption,
      status: 'cancelled',
      updateTime: new Date(),
    });

    return { message: '申请已取消', id };
  }

  /**
   * 删除领养申请
   *
   * 从数据库中永久删除申请记录
   *
   * @param id - 申请ID
   * @returns 删除结果消息
   *
   * @throws NotFoundException - 如果申请不存在
   *
   * 注意: 此操作不可逆，删除后无法恢复
   */
  async remove(id: number) {
    // 先获取申请信息，确保存在
    const adoption = await this.findOne(id);

    // 从数据库中删除
    await this.adoptionRepository.remove(adoption);

    return { message: '领养申请删除成功', id };
  }

  /**
   * 获取领养申请统计信息
   *
   * 统计领养申请的数量分布:
   * - 总数 (total)
   * - 待审核数量 (pending)
   * - 已通过数量 (approved)
   * - 已拒绝数量 (rejected)
   *
   * 注意: 不统计已取消 (cancelled) 的申请
   *
   * @returns 统计数据对象
   *
   * 响应示例:
   * {
   *   "total": 100,       // 申请总数
   *   "pending": 30,      // 待审核数量
   *   "approved": 50,     // 已通过数量
   *   "rejected": 20      // 已拒绝数量
   * }
   */
  async getStats() {
    // 并行执行多个计数查询，提高性能
    const [total, pending, approved, rejected] = await Promise.all([
      this.adoptionRepository.count(), // 总数
      this.adoptionRepository.count({
        where: { status: 'pending' }, // 待审核
      }),
      this.adoptionRepository.count({
        where: { status: 'approved' }, // 已通过
      }),
      this.adoptionRepository.count({
        where: { status: 'rejected' }, // 已拒绝
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }
}
