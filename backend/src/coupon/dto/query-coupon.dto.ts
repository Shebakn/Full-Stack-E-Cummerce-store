import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CouponType } from '@/common/enums/coupon-type.enum';

export class QueryCouponDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  orderBy?: 'createdAt' | 'expiryDate' | 'usedCount';

  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';
}