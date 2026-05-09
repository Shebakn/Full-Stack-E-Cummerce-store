import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsInt()
  stock?: number;

}