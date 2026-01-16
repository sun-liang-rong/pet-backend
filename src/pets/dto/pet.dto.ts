import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDecimal,
  IsNumber,
  IsUrl,
  IsArray,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsEnum(['dog', 'cat', 'rabbit', 'bird', 'hamster', 'other'])
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'hamster' | 'other';

  @IsString()
  breed: string;

  @IsNumber()
  age: number;

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(['healthy', 'treating', 'recovered', 'critical'])
  healthStatus?: 'healthy' | 'treating' | 'recovered' | 'critical';

  @IsOptional()
  @IsEnum(['available', 'pending', 'adopted', 'unavailable'])
  adoptionStatus?: 'available' | 'pending' | 'adopted' | 'unavailable';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  rescueDate?: string;

  @IsOptional()
  @IsString()
  rescuer?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['dog', 'cat', 'rabbit', 'bird', 'hamster', 'other'])
  type?: 'dog' | 'cat' | 'rabbit' | 'bird' | 'hamster' | 'other';

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsDecimal()
  age?: number;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: 'male' | 'female';

  @IsOptional()
  @IsDecimal()
  weight?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(['healthy', 'treating', 'recovered', 'critical'])
  healthStatus?: 'healthy' | 'treating' | 'recovered' | 'critical';

  @IsOptional()
  @IsEnum(['available', 'pending', 'adopted', 'unavailable'])
  adoptionStatus?: 'available' | 'pending' | 'adopted' | 'unavailable';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  rescueDate?: string;

  @IsOptional()
  @IsString()
  rescuer?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class PetQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  healthStatus?: string;

  @IsOptional()
  @IsString()
  adoptionStatus?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
