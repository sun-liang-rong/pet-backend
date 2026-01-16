import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from '../common';

@Public()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * 获取仪表盘概览数据
   * GET /dashboard/overview
   */
  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  /**
   * 获取领养趋势数据
   * GET /dashboard/adoption-trend
   */
  @Get('adoption-trend')
  getAdoptionTrend() {
    return this.dashboardService.getAdoptionTrend();
  }

  /**
   * 获取宠物类型分布
   * GET /dashboard/pet-distribution
   */
  @Get('pet-distribution')
  getPetTypeDistribution() {
    return this.dashboardService.getPetTypeDistribution();
  }

  /**
   * 获取近期申请
   * GET /dashboard/recent-applications?limit=5
   */
  @Get('recent-applications')
  getRecentApplications(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.dashboardService.getRecentApplications(parsedLimit);
  }

  /**
   * 获取完整的仪表盘数据（聚合接口）
   * GET /dashboard
   */
  @Get()
  getDashboardData() {
    return this.dashboardService.getDashboardData();
  }
}
