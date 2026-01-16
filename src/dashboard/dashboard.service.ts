import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { Adoption } from '../entities/adoption.entity';
import { Volunteer } from '../entities/volunteer.entity';

export interface DashboardOverview {
  totalPets: number;
  pendingAdoptions: number;
  adoptedPets: number;
  activeVolunteers: number;
}

export interface AdoptionTrend {
  name: string;
  apps: number;
}

export interface PetTypeDistribution {
  name: string;
  value: number;
}

export interface RecentApplication {
  applicationId: number;
  userId: number;
  petId: number;
  applicantName: string;
  petName: string;
  status: string;
  applicationDate: string;
}

export interface DashboardData {
  overview: DashboardOverview;
  adoptionTrend: AdoptionTrend[];
  petTypeDistribution: PetTypeDistribution[];
  recentApplications: RecentApplication[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Adoption)
    private readonly adoptionRepository: Repository<Adoption>,
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
  ) {}

  /**
   * 获取仪表盘概览数据
   */
  async getOverview(): Promise<DashboardOverview> {
    const [totalPets, adoptedPets, pendingAdoptions, activeVolunteers] =
      await Promise.all([
        this.petRepository.count(),
        this.petRepository.count({ where: { adoptionStatus: 'adopted' } }),
        this.adoptionRepository.count({ where: { status: 'pending' } }),
        this.volunteerRepository.count({ where: { status: 'active' } }),
      ]);

    return {
      totalPets,
      pendingAdoptions,
      adoptedPets,
      activeVolunteers,
    };
  }

  /**
   * 获取领养趋势数据（按月份统计）
   */
  async getAdoptionTrend(): Promise<AdoptionTrend[]> {
    const adoptions = await this.adoptionRepository.find({
      order: { applicationDate: 'DESC' },
      take: 100,
    });

    // 按月份统计
    const monthlyCount: Record<string, number> = {};

    adoptions.forEach((adoption) => {
      if (adoption.applicationDate) {
        const date = new Date(adoption.applicationDate);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCount[month] = (monthlyCount[month] || 0) + 1;
      }
    });

    // 转换为数组并排序
    const trendData = Object.entries(monthlyCount)
      .map(([name, apps]) => ({ name, apps }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-6); // 只返回最近6个月

    // 如果没有数据，返回默认数据
    if (trendData.length === 0) {
      return [
        { name: '2024-08', apps: 12 },
        { name: '2024-09', apps: 19 },
        { name: '2024-10', apps: 15 },
        { name: '2024-11', apps: 25 },
        { name: '2024-12', apps: 22 },
        { name: '2025-01', apps: 18 },
      ];
    }

    return trendData;
  }

  /**
   * 获取宠物类型分布
   */
  async getPetTypeDistribution(): Promise<PetTypeDistribution[]> {
    const pets = await this.petRepository.find();

    const typeCount: Record<string, number> = {};

    pets.forEach((pet) => {
      const type = pet.type || 'other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const distribution = Object.entries(typeCount).map(([name, value]) => ({
      name: name === 'dog' ? '狗' : name === 'cat' ? '猫' : '其他',
      value,
    }));

    if (distribution.length === 0) {
      return [
        { name: '狗', value: 5 },
        { name: '猫', value: 3 },
        { name: '其他', value: 2 },
      ];
    }

    return distribution;
  }

  /**
   * 获取近期申请列表
   */
  async getRecentApplications(limit: number = 5): Promise<RecentApplication[]> {
    const adoptions: Adoption[] = await this.adoptionRepository.find({
      order: { applicationDate: 'DESC' },
      take: limit,
    });

    return adoptions.map((adoption) => ({
      applicationId: adoption.id,
      userId: 0,
      petId: adoption.petId,
      applicantName: adoption.applicantName || '未知用户',
      petName: adoption.petName || '未知宠物',
      status: adoption.status || 'pending',
      applicationDate: adoption.applicationDate
        ? new Date(adoption.applicationDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    }));
  }

  /**
   * 获取完整的仪表盘数据
   */
  async getDashboardData(): Promise<DashboardData> {
    const [overview, adoptionTrend, petTypeDistribution, recentApplications] =
      await Promise.all([
        this.getOverview(),
        this.getAdoptionTrend(),
        this.getPetTypeDistribution(),
        this.getRecentApplications(),
      ]);

    return {
      overview,
      adoptionTrend,
      petTypeDistribution,
      recentApplications,
    };
  }
}
