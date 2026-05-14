import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({
    example: '7c2b1f3e-9c3a-4f2a-9d2d-1a8c9b6f1a11',
  })
  @IsUUID()
  couponId!: string;
}