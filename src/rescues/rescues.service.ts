import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rescue } from '../entities/rescue.entity';
import {
  CreateRescueDto,
  UpdateRescueDto,
  RescueQueryDto,
} from './dto/rescue.dto';

@Injectable()
export class RescuesService {
  constructor(
    @InjectRepository(Rescue)
    private readonly rescueRepository: Repository<Rescue>,
  ) {}

  async create(createRescueDto: CreateRescueDto) {
    const rescue = this.rescueRepository.create(createRescueDto);
    const savedRescue = await this.rescueRepository.save(rescue);
    return savedRescue;
  }

  async findAll(query: RescueQueryDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.rescueRepository.createQueryBuilder('rescue');

    if (filters.rescuer) {
      queryBuilder.andWhere('rescue.rescuer LIKE :rescuer', {
        rescuer: `%${filters.rescuer}%`,
      });
    }

    if (filters.rescueType) {
      queryBuilder.andWhere('rescue.rescueType = :rescueType', {
        rescueType: filters.rescueType,
      });
    }

    if (filters.healthCondition) {
      queryBuilder.andWhere('rescue.healthCondition = :healthCondition', {
        healthCondition: filters.healthCondition,
      });
    }

    if (filters.rescueLocation) {
      queryBuilder.andWhere('rescue.rescueLocation LIKE :rescueLocation', {
        rescueLocation: `%${filters.rescueLocation}%`,
      });
    }

    queryBuilder.orderBy('rescue.rescueDate', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [rescues, total] = await queryBuilder.getManyAndCount();

    return {
      data: rescues,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const rescue = await this.rescueRepository.findOne({
      where: { id },
    });

    if (!rescue) {
      throw new NotFoundException('救援记录不存在');
    }

    return rescue;
  }

  async update(id: number, updateRescueDto: UpdateRescueDto) {
    const rescue = await this.findOne(id);

    const updatedRescue = await this.rescueRepository.save({
      ...rescue,
      ...updateRescueDto,
      updateTime: new Date(),
    });

    return updatedRescue;
  }

  async remove(id: number) {
    const rescue = await this.findOne(id);
    await this.rescueRepository.remove(rescue);
    return { message: '救援记录删除成功' };
  }

  async getStats() {
    const total = await this.rescueRepository.count();
    const pending = await this.rescueRepository.count({
      where: { healthCondition: 'critical' },
    });
    const completed = await this.rescueRepository.count({
      where: { healthCondition: 'healthy' },
    });

    const totalCost = await this.rescueRepository
      .createQueryBuilder('rescue')
      .select('SUM(rescue.cost)', 'total')
      .getRawOne();

    return {
      total,
      pending,
      completed,
      totalCost: totalCost?.total || 0,
    };
  }
}
