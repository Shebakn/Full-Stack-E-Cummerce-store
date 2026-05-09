import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { CouponType } from '@/common/enums/coupon-type.enum';

export class CreateCouponDto {
  @IsString()
 code!: string;

  @IsEnum(CouponType)
  type: CouponType = "PERCENTAGE";

  @IsNumber()
    @Min(0)
    value!: number;

  @IsOptional()
  @IsNumber()
  minOrder?: number;

  @IsOptional()
  @IsNumber()
  maxUsage?: number;

  @IsDateString()
    expiryDate!: Date;

  @IsOptional()
  @IsDateString()
  startDate?: Date;
}