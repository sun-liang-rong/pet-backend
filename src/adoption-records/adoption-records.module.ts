import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionRecordsService } from './adoption-records.service';
import { AdoptionRecordsController } from './adoption-records.controller';
import { AdoptionRecord } from '../entities/adoption-record.entity';

/**
 * 领养记录模块
 *
 * 功能:
 * - 领养记录的增删改查
 * - 回访记录管理
 * - 领养统计
 */
@Module({
  imports: [TypeOrmModule.forFeature([AdoptionRecord])],
  controllers: [AdoptionRecordsController],
  providers: [AdoptionRecordsService],
  exports: [AdoptionRecordsService],
})
export class AdoptionRecordsModule {}
