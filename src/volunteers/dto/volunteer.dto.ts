import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVolunteerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  availableTime?: string;

  @Type(() => Date)
  @IsDateString()
  joinDate: Date;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateVolunteerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  availableTime?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive';

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  joinDate?: Date;

  @IsOptional()
  @IsNumber()
  activitiesParticipated?: number;

  @IsOptional()
  @IsNumber()
  totalHours?: number;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class VolunteerQueryDto {
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
  status?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  skills?: string;
}
