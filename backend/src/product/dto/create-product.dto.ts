import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsUrl,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  // =========================
  // BASIC INFO
  // =========================
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price!: number;

  // =========================
  // IMAGE (URL OPTION ONLY)
  // =========================
  @ApiPropertyOptional({
    description: 'Image URL (if no file upload is used)',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageCover?: string;

  // =========================
  // RELATIONS
  // =========================
  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  brandId?: string;
}