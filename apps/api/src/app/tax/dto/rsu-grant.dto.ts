import { IsString, IsDateString, IsInt, IsNumber, IsObject, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRsuGrantDto {
  @IsString()
  grantId: string;

  @IsDateString()
  grantDate: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalShares: number;

  @IsObject()
  vestingSchedule: any; // JSON vesting schedule

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  strikePrice?: number;
}

export class UpdateRsuGrantDto {
  @IsOptional()
  @IsString()
  grantId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalShares?: number;

  @IsOptional()
  @IsObject()
  vestingSchedule?: any;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  strikePrice?: number;
}

export class CreateRsuVestingDto {
  @IsDateString()
  vestDate: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  sharesVested: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  fmvPerShare: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  exchangeRate: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  taxWithheldUSD?: number;
}