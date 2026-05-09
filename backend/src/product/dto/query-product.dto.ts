import { Type, Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsUUID,
  IsString,
  Min,
  Max,
  IsBoolean,
  IsIn,
  IsArray,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
  // ================= PAGINATION =================
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  // ================= CATEGORY =================
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Comma separated category IDs',
    example: 'id1,id2,id3',
  })
  @Transform(({ value }) => {
  if (!value) return undefined;

  if (typeof value === 'string') {
    return value.split(',').filter(Boolean);
  }

  return value;
})
@IsOptional()
@IsArray()
@IsUUID('4', { each: true })
categoryIds?: string[];

  // ================= BRAND =================
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  brandId?: string;

  // ================= PRICE RANGE =================
  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  // ================= SEARCH =================
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  // ================= CHILD CATEGORY =================
  @ApiPropertyOptional()
@Transform(({ value }) => {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
})
@IsOptional()
@IsBoolean()
includeChildren?: boolean;

  // ================= SORT =================
  @ApiPropertyOptional({ enum: ['createdAt', 'price', 'ratingsAverage'] })
  @IsOptional()
  @IsIn(['createdAt', 'price', 'ratingsAverage'])
  orderBy?: 'createdAt' | 'price' | 'ratingsAverage';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';

  // ================= RATINGS FILTER =================
  @Transform(({ value }) => {
  if (!value) return undefined;

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(Number)
      .filter((v) => !isNaN(v));
  }

  return value;
})
@IsOptional()
@IsArray()
@IsNumber({}, { each: true })
ratings?: number[];
}