import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRescueDto {
  @IsNumber()
  petId: number;

  @IsString()
  petName: string;

  @Type(() => Date)
  @IsDateString()
  rescueDate: Date;

  @IsString()
  rescueLocation: string;

  @IsString()
  rescuer: string;

  @IsString()
  rescueType: string;

  @IsString()
  description: string;

  @IsString()
  healthCondition: string;

  @IsString()
  immediateAction: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRescueDto {
  @IsOptional()
  @IsNumber()
  petId?: number;

  @IsOptional()
  @IsString()
  petName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  rescueDate?: Date;

  @IsOptional()
  @IsString()
  rescueLocation?: string;

  @IsOptional()
  @IsString()
  rescuer?: string;

  @IsOptional()
  @IsString()
  rescueType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  healthCondition?: string;

  @IsOptional()
  @IsString()
  immediateAction?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RescueQueryDto {
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
  rescuer?: string;

  @IsOptional()
  @IsString()
  rescueType?: string;

  @IsOptional()
  @IsString()
  healthCondition?: string;

  @IsOptional()
  @IsString()
  rescueLocation?: string;
}
