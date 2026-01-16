import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';
import {
  CreateDonationDto,
  UpdateDonationDto,
  DonationQueryDto,
} from './dto/donation.dto';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    const donation = this.donationRepository.create({
      ...createDonationDto,
      status: 'pending',
      donationDate: createDonationDto.donationDate || new Date(),
    });
    const savedDonation = await this.donationRepository.save(donation);
    return savedDonation;
  }

  async findAll(query: DonationQueryDto) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.donationRepository.createQueryBuilder('donation');

    if (filters.status) {
      queryBuilder.andWhere('donation.status = :status', {
        status: filters.status,
      });
    }

    if (filters.donorName) {
      queryBuilder.andWhere('donation.donorName LIKE :donorName', {
        donorName: `%${filters.donorName}%`,
      });
    }

    if (filters.donationType) {
      queryBuilder.andWhere('donation.donationType = :donationType', {
        donationType: filters.donationType,
      });
    }

    if (filters.donorType) {
      queryBuilder.andWhere('donation.donorType = :donorType', {
        donorType: filters.donorType,
      });
    }

    queryBuilder.orderBy('donation.donationDate', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [donations, total] = await queryBuilder.getManyAndCount();

    return {
      data: donations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const donation = await this.donationRepository.findOne({
      where: { id },
    });

    if (!donation) {
      throw new NotFoundException('捐赠记录不存在');
    }

    return donation;
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    const donation = await this.findOne(id);

    const updatedDonation = await this.donationRepository.save({
      ...donation,
      ...updateDonationDto,
      updateTime: new Date(),
    });

    return updatedDonation;
  }

  async confirm(id: number) {
    const donation = await this.findOne(id);

    await this.donationRepository.save({
      ...donation,
      status: 'confirmed',
      updateTime: new Date(),
    });

    return { message: '捐赠已确认' };
  }

  async cancel(id: number) {
    const donation = await this.findOne(id);

    await this.donationRepository.save({
      ...donation,
      status: 'cancelled',
      updateTime: new Date(),
    });

    return { message: '捐赠已取消' };
  }

  async issueReceipt(id: number) {
    const donation = await this.findOne(id);

    await this.donationRepository.save({
      ...donation,
      receiptIssued: true,
      updateTime: new Date(),
    });

    return { message: '收据已发放' };
  }

  async remove(id: number) {
    const donation = await this.findOne(id);
    await this.donationRepository.remove(donation);
    return { message: '捐赠记录删除成功' };
  }

  async getStats() {
    const total = await this.donationRepository.count();
    const pending = await this.donationRepository.count({
      where: { status: 'pending' },
    });
    const confirmed = await this.donationRepository.count({
      where: { status: 'confirmed' },
    });

    const totalAmount = await this.donationRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.status = :status', { status: 'confirmed' })
      .getRawOne();

    return {
      total,
      pending,
      confirmed,
      totalAmount: totalAmount?.total || 0,
    };
  }
}
