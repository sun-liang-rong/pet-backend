import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsString()
  type: 'adoption' | 'volunteer' | 'training' | 'fundraising' | 'education';

  @Type(() => Date)
  @IsDateString()
  startDate: Date;

  @Type(() => Date)
  @IsDateString()
  endDate: Date;

  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  participantLimit?: number;

  @IsString()
  organizer: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  type?: 'adoption' | 'volunteer' | 'training' | 'fundraising' | 'education';

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  participantLimit?: number;

  @IsOptional()
  @IsNumber()
  participantCount?: number;

  @IsOptional()
  @IsString()
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

  @IsOptional()
  @IsString()
  organizer?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class ActivityQueryDto {
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
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
