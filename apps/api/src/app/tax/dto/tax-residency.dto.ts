import { IsString, IsDateString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaxResidencyDto {
  @IsInt()
  @Min(2020)
  @Max(2030)
  @Type(() => Number)
  year: number;

  @IsString()
  country: string; // 'CA', 'US', 'IN'

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class UpdateTaxResidencyDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}