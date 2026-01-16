import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationQueryDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      isRead: false,
    });
    const savedNotification =
      await this.notificationRepository.save(notification);
    return savedNotification;
  }

  async findAll(query: NotificationQueryDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.notificationRepository.createQueryBuilder('notification');

    if (filters.type) {
      queryBuilder.andWhere('notification.type = :type', {
        type: filters.type,
      });
    }

    if (filters.unreadOnly) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
    }

    queryBuilder.orderBy('notification.createTime', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('通知不存在');
    }

    return notification;
  }

  async markAsRead(id: number) {
    const notification = await this.findOne(id);

    await this.notificationRepository.save({
      ...notification,
      isRead: true,
      updateTime: new Date(),
    });

    return { message: '已标记为已读' };
  }

  async markAllAsRead() {
    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true, updateTime: new Date() },
    );

    return { message: '已全部标记为已读' };
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);

    const updatedNotification = await this.notificationRepository.save({
      ...notification,
      ...updateNotificationDto,
      updateTime: new Date(),
    });

    return updatedNotification;
  }

  async remove(id: number) {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
    return { message: '通知删除成功' };
  }

  async getUnreadCount() {
    const count = await this.notificationRepository.count({
      where: { isRead: false },
    });

    return { unreadCount: count };
  }
}
