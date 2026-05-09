import { Expose, Type } from 'class-transformer';
import { CouponType } from '@prisma/client';

export class CouponResponseDto {
  @Expose()
    id!: string;

  @Expose()
    code!: string;

  @Expose()
  type: CouponType = "PERCENTAGE";

  @Expose()
    value!: number;

  @Expose()
  minOrder?: number;

  @Expose()
  maxUsage?: number;

  @Expose()
    usedCount!: number;

  @Expose()
    isActive!: boolean;

  @Expose()
    @Type(() => Date)
    startDate!: Date;

  @Expose()
    @Type(() => Date)
    expiryDate!: Date;

  @Expose()
    createdAt!: Date;

  @Expose()
    updatedAt!: Date;
}