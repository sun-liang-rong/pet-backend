import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { AdoptionRecord } from '../entities/adoption-record.entity';
import {
  AdoptionRecordQueryDto,
  CreateAdoptionRecordDto,
  UpdateAdoptionRecordDto,
  AddFollowUpDto,
} from './dto/adoption-record.dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * 领养记录服务
 * 提供领养记录的增删改查和回访记录管理功能
 */
@Injectable()
export class AdoptionRecordsService {
  constructor(
    @InjectRepository(AdoptionRecord)
    private readonly adoptionRecordRepository: Repository<AdoptionRecord>,
  ) {}

  /**
   * 生成领养记录编号
   * 格式: AR-YYYY-XXXXXX
   */
  private generateRecordNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `AR-${year}-${random}`;
  }

  /**
   * 创建领养记录
   * POST /adoption-records
   *
   * @param createDto - 创建数据
   * @param operator - 操作人
   * @returns 创建后的领养记录
   */
  async create(createDto: CreateAdoptionRecordDto, operator: string = 'system'): Promise<AdoptionRecord> {
    const record = this.adoptionRecordRepository.create({
      ...createDto,
      recordNumber: this.generateRecordNumber(),
      adoptionDate: new Date(createDto.adoptionDate),
      status: 'active',
      followUps: [],
      createdBy: operator,
      updatedBy: operator,
    });

    return this.adoptionRecordRepository.save(record);
  }

  /**
   * 获取领养记录列表（支持分页和筛选）
   * GET /adoption-records
   *
   * @param query - 查询参数
   * @returns 分页后的领养记录列表
   */
  async findAll(query: AdoptionRecordQueryDto): Promise<{
    data: AdoptionRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, status, petName, adopterName, recordNumber, startDate, endDate } = query;

    const queryBuilder = this.adoptionRecordRepository.createQueryBuilder('record');

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('record.status = :status', { status });
    }

    // 宠物名称模糊搜索
    if (petName) {
      queryBuilder.andWhere('record.petName LIKE :petName', { petName: `%${petName}%` });
    }

    // 领养人姓名模糊搜索
    if (adopterName) {
      queryBuilder.andWhere('record.adopterName LIKE :adopterName', { adopterName: `%${adopterName}%` });
    }

    // 记录编号精确搜索
    if (recordNumber) {
      queryBuilder.andWhere('record.recordNumber = :recordNumber', { recordNumber });
    }

    // 日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('record.adoptionDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // 按领养日期降序排序
    queryBuilder.orderBy('record.adoptionDate', 'DESC');

    // 分页
    const total = await queryBuilder.getCount();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * 获取领养记录统计
   * GET /adoption-records/stats
   *
   * @returns 统计数据
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    pendingFollowUp: number;
  }> {
    const total = await this.adoptionRecordRepository.count();
    const active = await this.adoptionRecordRepository.count({ where: { status: 'active' } });
    const completed = await this.adoptionRecordRepository.count({ where: { status: 'completed' } });
    const cancelled = await this.adoptionRecordRepository.count({ where: { status: 'cancelled' } });

    // 待回访: 状态为active且已过下次回访日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pendingFollowUp = await this.adoptionRecordRepository
      .createQueryBuilder('record')
      .where('record.status = :status', { status: 'active' })
      .andWhere('record.nextFollowUpDate < :today', { today })
      .getCount();

    return {
      total,
      active,
      completed,
      cancelled,
      pendingFollowUp,
    };
  }

  /**
   * 获取单条领养记录详情
   * GET /adoption-records/:id
   *
   * @param id - 记录ID
   * @returns 领养记录详情
   */
  async findOne(id: string): Promise<AdoptionRecord> {
    const record = await this.adoptionRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`领养记录不存在: ${id}`);
    }
    return record;
  }

  /**
   * 更新领养记录
   * PATCH /adoption-records/:id
   *
   * @param id - 记录ID
   * @param updateDto - 更新数据
   * @param operator - 操作人
   * @returns 更新后的记录
   */
  async update(
    id: string,
    updateDto: UpdateAdoptionRecordDto,
    operator: string = 'system',
  ): Promise<AdoptionRecord> {
    const record = await this.findOne(id);

    Object.assign(record, updateDto);
    record.updatedBy = operator;

    return this.adoptionRecordRepository.save(record);
  }

  /**
   * 删除领养记录
   * DELETE /adoption-records/:id
   *
   * @param id - 记录ID
   * @returns 删除结果
   */
  async remove(id: string): Promise<{ message: string }> {
    const record = await this.findOne(id);
    await this.adoptionRecordRepository.remove(record);
    return { message: '领养记录已删除' };
  }

  /**
   * 添加回访记录
   * POST /adoption-records/:id/follow-up
   *
   * @param id - 记录ID
   * @param followUpDto - 回访数据
   * @param operator - 操作人
   * @returns 更新后的记录
   */
  async addFollowUp(
    id: string,
    followUpDto: AddFollowUpDto,
    operator: string = 'system',
  ): Promise<AdoptionRecord> {
    const record = await this.findOne(id);

    const newFollowUp = {
      id: uuidv4(),
      date: new Date().toISOString(),
      content: followUpDto.content,
      operator: followUpDto.operator || operator,
      nextFollowUpDate: followUpDto.nextFollowUpDate || undefined,
    };

    // 添加新回访记录
    const followUps = record.followUps || [];
    followUps.push(newFollowUp);

    // 更新最后回访日期和下次回访日期
    record.followUps = followUps;
    record.lastFollowUpDate = new Date();
    record.nextFollowUpDate = followUpDto.nextFollowUpDate
      ? new Date(followUpDto.nextFollowUpDate)
      : null;
    record.updatedBy = operator;

    return this.adoptionRecordRepository.save(record);
  }

  /**
   * 根据原始申请ID创建领养记录
   * 用于从领养申请转换为正式领养记录
   *
   * @param applicationId - 原始申请ID
   * @param operator - 操作人
   * @returns 创建的领养记录
   */
  async createFromAdoption(
    applicationId: number,
    operator: string = 'system',
  ): Promise<AdoptionRecord> {
    // 这里需要从AdoptionsService获取申请信息
    // 暂时返回错误，实际使用时需要调用adoptionsService
    throw new NotFoundException('需要提供完整的申请信息来创建领养记录');
  }
}
