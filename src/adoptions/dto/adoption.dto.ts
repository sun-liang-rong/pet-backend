import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdoptionDto {
  @IsNumber()
  petId: number;

  @IsString()
  petName: string;

  @IsString()
  applicantName: string;

  @IsString()
  applicantPhone: string;

  @IsEmail()
  applicantEmail: string;

  @IsString()
  applicantIdCard: string;

  @IsString()
  applicantAddress: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  housingType?: string;

  @IsOptional()
  @IsBoolean()
  hasYard?: boolean;

  @IsOptional()
  @IsNumber()
  familyMembers?: number;

  @IsOptional()
  @IsString()
  workHours?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateAdoptionDto {
  @IsOptional()
  @IsNumber()
  petId?: number;

  @IsOptional()
  @IsString()
  petName?: string;

  @IsOptional()
  @IsString()
  applicantName?: string;

  @IsOptional()
  @IsString()
  applicantPhone?: string;

  @IsOptional()
  @IsEmail()
  applicantEmail?: string;

  @IsOptional()
  @IsString()
  applicantIdCard?: string;

  @IsOptional()
  @IsString()
  applicantAddress?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  housingType?: string;

  @IsOptional()
  @IsBoolean()
  hasYard?: boolean;

  @IsOptional()
  @IsNumber()
  familyMembers?: number;

  @IsOptional()
  @IsString()
  workHours?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class AdoptionQueryDto {
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
  applicantName?: string;

  @IsOptional()
  @IsString()
  petName?: string;
}

export class ApproveAdoptionDto {
  @IsString()
  status: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  approver?: string;

  @IsOptional()
  @IsString()
  rejecter?: string;

  @IsOptional()
  @IsString()
  rejectReason?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
