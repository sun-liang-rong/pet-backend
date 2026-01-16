import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateNotificationDto {
  @IsString()
  type: 'adoption' | 'rescue' | 'donation' | 'activity' | 'system';

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetId?: number;

  @IsOptional()
  @IsString()
  targetType?: string;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  type?: 'adoption' | 'rescue' | 'donation' | 'activity' | 'system';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetId?: number;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class NotificationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  unreadOnly?: boolean;
}
