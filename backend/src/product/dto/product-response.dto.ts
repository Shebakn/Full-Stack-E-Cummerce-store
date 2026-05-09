import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ImageDto {
  @ApiProperty() @Expose() original!: string;
  @ApiProperty() @Expose() small!: string;
  @ApiProperty() @Expose() medium!: string;
  @ApiProperty() @Expose() large!: string;
}

class CategoryDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() name!: string;
}

class BrandDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() name!: string;
}

class ProductImageDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() isCover!: boolean;
  @ApiProperty() @Expose() position!: number;

  @ApiProperty({ type: ImageDto })
  @Expose()
  @Type(() => ImageDto)
  url!: ImageDto;
}

class VariantAttributeDto {
  @ApiProperty() @Expose() name!: string;
  @ApiProperty() @Expose() value!: string;
}

class VariantDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() sku?: string;
  @ApiProperty() @Expose() price!: number;
  @ApiProperty() @Expose() stock!: number;

  @ApiProperty({ type: [VariantAttributeDto] })
  @Expose()
  @Type(() => VariantAttributeDto)
  attributes!: VariantAttributeDto[];
}

class ReviewUserDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() name!: string;
  @ApiProperty() @Expose() avatar?: string;
}

class ReviewDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() rating!: number;
  @ApiProperty() @Expose() reviewText?: string;

  @ApiProperty({ type: ReviewUserDto })
  @Expose()
  @Type(() => ReviewUserDto)
  user!: ReviewUserDto;
}

export class ProductResponseDto {
  @ApiProperty() @Expose() id!: string;
  @ApiProperty() @Expose() title!: string;
  @ApiProperty() @Expose() description!: string;
  @ApiProperty() @Expose() price!: number;

  @ApiProperty({ type: ImageDto })
  @Expose()
  @Type(() => ImageDto)
  imageCover!: ImageDto;

  @ApiProperty() @Expose() sold!: number;
  @ApiProperty() @Expose() ratingsAverage!: number;
  @ApiProperty() @Expose() ratingsQuantity!: number;

  @ApiProperty({ type: CategoryDto })
  @Expose()
  @Type(() => CategoryDto)
  category!: CategoryDto;

  @ApiProperty({ type: BrandDto, nullable: true })
  @Expose()
  @Type(() => BrandDto)
  brand?: BrandDto | null;

  @ApiProperty({ type: [ProductImageDto] })
  @Expose()
  @Type(() => ProductImageDto)
  images!: ProductImageDto[];

  @ApiProperty({ type: [VariantDto] })
  @Expose()
  @Type(() => VariantDto)
  variants!: VariantDto[];

  @ApiProperty({ type: [ReviewDto] })
  @Expose()
  @Type(() => ReviewDto)
  reviews!: ReviewDto[];

  @ApiProperty() @Expose() createdAt!: Date;
  @ApiProperty() @Expose() updatedAt!: Date;
}