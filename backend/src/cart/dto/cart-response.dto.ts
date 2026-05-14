import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CartItemResponseDto } from './cart-item-response.dto';
import { CartSummaryDto } from './cart-summary.dto';

export class CartResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  userId!: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  @Expose()
  @Type(() => CartItemResponseDto)
  items!: CartItemResponseDto[];

  @ApiProperty({ type: CartSummaryDto })
  @Expose()
  @Type(() => CartSummaryDto)
  summary!: CartSummaryDto;

  @ApiProperty({ required: false })
  @Expose()
  couponId?: string | null;
}