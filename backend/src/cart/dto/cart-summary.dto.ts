import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CartSummaryDto {
  @ApiProperty()
  @Expose()
  subtotal!: number;

  @ApiProperty()
  @Expose()
  discount!: number;

  @ApiProperty()
  @Expose()
  total!: number;
}