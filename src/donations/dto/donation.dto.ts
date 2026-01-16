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

export class CreateDonationDto {
  @IsString()
  donorName: string;

  @IsOptional()
  @IsString()
  donorType?: 'individual' | 'organization';

  @IsNumber()
  amount: number;

  @Type(() => Date)
  @IsDateString()
  donationDate: Date;

  @IsOptional()
  @IsString()
  donationType?: 'money' | 'goods';

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsArray()
  items?: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimatedValue: number;
  }>;

  @IsOptional()
  @IsNumber()
  totalValue?: number;
}

export class UpdateDonationDto {
  @IsOptional()
  @IsString()
  donorName?: string;

  @IsOptional()
  @IsString()
  donorType?: 'individual' | 'organization';

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  donationDate?: Date;

  @IsOptional()
  @IsString()
  donationType?: 'money' | 'goods';

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  status?: 'pending' | 'confirmed' | 'cancelled';

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  receiptIssued?: boolean;

  @IsOptional()
  @IsArray()
  items?: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimatedValue: number;
  }>;

  @IsOptional()
  @IsNumber()
  totalValue?: number;
}

export class DonationQueryDto {
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
  donorName?: string;

  @IsOptional()
  @IsString()
  donationType?: string;

  @IsOptional()
  @IsString()
  donorType?: string;
}
