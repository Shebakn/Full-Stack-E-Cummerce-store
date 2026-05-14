import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';

/* ================= PRODUCT (LIGHT) ================= */
export class CartProductDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  title!: string;

  @ApiProperty({ required: false })
  @Expose()
  imageCover?: string;
}

/* ================= VARIANT (LIGHT) ================= */
export class CartVariantDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty({ example: { color: 'Red', size: 'M' } })
  @Expose()
  attributes!: Record<string, any>;
}

/* ================= CART ITEM ================= */
export class CartItemResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  quantity!: number;

  // ✅ السعر وقت الإضافة (snapshot)
  @ApiProperty({ example: 25 })
  @Expose()
  @Transform(({ value }) => Number(value))
  unitPrice!: number;

  // ✅ total لكل item
  @ApiProperty({ example: 50 })
  @Expose()
  total!: number;

  /* PRODUCT */
  @ApiProperty({ type: CartProductDto })
  @Expose()
  @Type(() => CartProductDto)
  product!: CartProductDto;

  /* VARIANT */
  @ApiProperty({ type: CartVariantDto, required: false })
  @Expose()
  @Type(() => CartVariantDto)
  variant?: CartVariantDto;
}