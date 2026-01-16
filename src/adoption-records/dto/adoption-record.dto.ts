import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 领养记录查询参数DTO
 */
export class AdoptionRecordQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: 'active' | 'completed' | 'cancelled';

  @IsOptional()
  @IsString()
  petName?: string;

  @IsOptional()
  @IsString()
  adopterName?: string;

  @IsOptional()
  @IsString()
  recordNumber?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

/**
 * 创建领养记录DTO
 */
export class CreateAdoptionRecordDto {
  /**
   * 关联的领养申请ID (可选)
   */
  @IsOptional()
  @IsNumber()
  adoptionApplicationId?: number;

  /**
   * 宠物ID (必填)
   */
  @IsNumber()
  petId: number;

  /**
   * 宠物名称
   */
  @IsString()
  @Length(1, 100)
  petName: string;

  /**
   * 宠物品种
   */
  @IsOptional()
  @IsString()
  @Length(0, 100)
  petBreed?: string;

  /**
   * 宠物图片URL
   */
  @IsOptional()
  @IsString()
  petImage?: string;

  /**
   * 领养人ID (必填)
   */
  @IsNumber()
  adopterId: number;

  /**
   * 领养人姓名 (必填)
   */
  @IsString()
  @Length(1, 100)
  adopterName: string;

  /**
   * 领养人联系电话
   */
  @IsOptional()
  @IsString()
  @Length(0, 20)
  adopterPhone?: string;

  /**
   * 领养人邮箱
   */
  @IsOptional()
  @IsString()
  @Length(0, 100)
  adopterEmail?: string;

  /**
   * 领养人地址
   */
  @IsOptional()
  @IsString()
  adopterAddress?: string;

  /**
   * 领养完成日期 (必填)
   */
  @IsDateString()
  adoptionDate: string;

  /**
   * 协议编号
   */
  @IsOptional()
  @IsString()
  @Length(0, 100)
  agreementNumber?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString()
  remarks?: string;
}

/**
 * 更新领养记录DTO
 */
export class UpdateAdoptionRecordDto {
  /**
   * 领养状态
   */
  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: 'active' | 'completed' | 'cancelled';

  /**
   * 领养人联系电话
   */
  @IsOptional()
  @IsString()
  @Length(0, 20)
  adopterPhone?: string;

  /**
   * 领养人邮箱
   */
  @IsOptional()
  @IsString()
  @Length(0, 100)
  adopterEmail?: string;

  /**
   * 领养人地址
   */
  @IsOptional()
  @IsString()
  adopterAddress?: string;

  /**
   * 备注
   */
  @IsOptional()
  @IsString()
  remarks?: string;
}

/**
 * 添加回访记录DTO
 */
export class AddFollowUpDto {
  /**
   * 回访内容
   */
  @IsString()
  @Length(1, 2000)
  content: string;

  /**
   * 回访人
   */
  @IsString()
  @Length(1, 50)
  operator: string;

  /**
   * 下次回访日期
   */
  @IsOptional()
  @IsDateString()
  nextFollowUpDate?: string;
}

/**
 * 回访记录详情
 */
export class FollowUpItemDto {
  id: string;
  date: string;
  content: string;
  operator: string;
  nextFollowUpDate?: string;
}
