import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import {
  CreateActivityDto,
  UpdateActivityDto,
  ActivityQueryDto,
} from './dto/activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      status: 'upcoming',
      participantCount: 0,
    });
    const savedActivity = await this.activityRepository.save(activity);
    return savedActivity;
  }

  async findAll(query: ActivityQueryDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.activityRepository.createQueryBuilder('activity');

    if (filters.type) {
      queryBuilder.andWhere('activity.type = :type', { type: filters.type });
    }

    if (filters.status) {
      queryBuilder.andWhere('activity.status = :status', {
        status: filters.status,
      });
    }

    if (filters.title) {
      queryBuilder.andWhere('activity.title LIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.location) {
      queryBuilder.andWhere('activity.location LIKE :location', {
        location: `%${filters.location}%`,
      });
    }

    queryBuilder.orderBy('activity.startDate', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [activities, total] = await queryBuilder.getManyAndCount();

    return {
      data: activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const activity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException('活动不存在');
    }

    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    const activity = await this.findOne(id);

    const updatedActivity = await this.activityRepository.save({
      ...activity,
      ...updateActivityDto,
      updateTime: new Date(),
    });

    return updatedActivity;
  }

  async incrementParticipants(id: number) {
    const activity = await this.findOne(id);

    if (
      activity.participantLimit &&
      activity.participantCount >= activity.participantLimit
    ) {
      throw new BadRequestException('活动参与人数已满');
    }

    await this.activityRepository.increment({ id }, 'participantCount', 1);
    return { message: '报名成功' };
  }

  async decrementParticipants(id: number) {
    const activity = await this.findOne(id);

    if (activity.participantCount > 0) {
      await this.activityRepository.decrement({ id }, 'participantCount', 1);
    }

    return { message: '取消报名成功' };
  }

  async remove(id: number) {
    const activity = await this.findOne(id);
    await this.activityRepository.remove(activity);
    return { message: '活动删除成功' };
  }

  async getStats() {
    const total = await this.activityRepository.count();
    const upcoming = await this.activityRepository.count({
      where: { status: 'upcoming' },
    });
    const ongoing = await this.activityRepository.count({
      where: { status: 'ongoing' },
    });
    const completed = await this.activityRepository.count({
      where: { status: 'completed' },
    });

    return {
      total,
      upcoming,
      ongoing,
      completed,
    };
  }
}
