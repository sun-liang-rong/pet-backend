import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from '../entities/volunteer.entity';
import {
  CreateVolunteerDto,
  UpdateVolunteerDto,
  VolunteerQueryDto,
} from './dto/volunteer.dto';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
  ) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    const volunteer = this.volunteerRepository.create({
      ...createVolunteerDto,
      status: 'active',
      activitiesParticipated: 0,
      totalHours: 0,
    });
    const savedVolunteer = await this.volunteerRepository.save(volunteer);
    return savedVolunteer;
  }

  async findAll(query: VolunteerQueryDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.volunteerRepository.createQueryBuilder('volunteer');

    if (filters.status) {
      queryBuilder.andWhere('volunteer.status = :status', {
        status: filters.status,
      });
    }

    if (filters.name) {
      queryBuilder.andWhere('volunteer.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.skills) {
      queryBuilder.andWhere('volunteer.skills LIKE :skills', {
        skills: `%${filters.skills}%`,
      });
    }

    queryBuilder.orderBy('volunteer.joinDate', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [volunteers, total] = await queryBuilder.getManyAndCount();

    return {
      data: volunteers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id },
    });

    if (!volunteer) {
      throw new NotFoundException('志愿者不存在');
    }

    return volunteer;
  }

  async update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
    const volunteer = await this.findOne(id);

    const updatedVolunteer = await this.volunteerRepository.save({
      ...volunteer,
      ...updateVolunteerDto,
      updateTime: new Date(),
    });

    return updatedVolunteer;
  }

  async incrementHours(id: number, hours: number) {
    const volunteer = await this.findOne(id);

    await this.volunteerRepository.save({
      ...volunteer,
      activitiesParticipated: volunteer.activitiesParticipated + 1,
      totalHours: volunteer.totalHours + hours,
      updateTime: new Date(),
    });

    return { message: '服务时长更新成功' };
  }

  async remove(id: number) {
    const volunteer = await this.findOne(id);
    await this.volunteerRepository.remove(volunteer);
    return { message: '志愿者删除成功' };
  }

  async getStats() {
    const total = await this.volunteerRepository.count();
    const active = await this.volunteerRepository.count({
      where: { status: 'active' },
    });
    const inactive = await this.volunteerRepository.count({
      where: { status: 'inactive' },
    });

    const totalHours = await this.volunteerRepository
      .createQueryBuilder('volunteer')
      .select('SUM(volunteer.totalHours)', 'total')
      .getRawOne();

    return {
      total,
      active,
      inactive,
      totalHours: totalHours?.total || 0,
    };
  }
}
