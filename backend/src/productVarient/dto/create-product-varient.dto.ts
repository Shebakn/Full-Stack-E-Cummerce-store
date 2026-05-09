import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VariantAttributeDto } from './variant-attribute.dto';

export class CreateProductVariantDto {
  @ApiPropertyOptional({
    example: 'SKU-RED-XL-001',
    description: 'Stock Keeping Unit (optional but recommended)',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    example: 29.99,
    description: 'Variant price',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    example: 100,
    description: 'Stock quantity',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({
    type: [VariantAttributeDto],
    example: [
      { name: 'color', value: 'red' },
      { name: 'size', value: 'XL' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeDto)
  attributes!: VariantAttributeDto[];
}