import { IsNumber, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmploymentIncomeDto {
  @IsInt()
  @Min(2020)
  @Max(2030)
  @Type(() => Number)
  year: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  baseSalary: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  bonusPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bonusAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  province?: string;
}

export class UpdateEmploymentIncomeDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  baseSalary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  bonusPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bonusAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  province?: string;
}