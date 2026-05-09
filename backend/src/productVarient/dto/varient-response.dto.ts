import { Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VariantAttributeResponseDto {
  @ApiProperty({ example: 'color' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 'red' })
  @Expose()
  value!: string;
}

export class ProductVariantResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty({ required: false, example: 'SKU-123' })
  @Expose()
  sku?: string;

  @ApiProperty({ example: 29.99 })
  @Expose()
  @Transform(({ value }) => Number(value))
  price!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  stock!: number;

  @ApiProperty()
  @Expose()
  productId!: string;

  @ApiProperty({
    type: [VariantAttributeResponseDto],
  })
  @Expose()
  @Type(() => VariantAttributeResponseDto)
  attributes!: VariantAttributeResponseDto[];

  @ApiProperty()
  @Expose()
  createdAt!: Date;
}