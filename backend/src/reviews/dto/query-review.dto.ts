import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsIn,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryReviewDto {
  // ================= PAGINATION =================
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  // ================= FILTERS =================
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  // ================= SEARCH =================
  @ApiPropertyOptional({ example: 'good product' })
  @IsOptional()
  @IsString()
  search?: string;

  // ================= SORT =================
  @ApiPropertyOptional({ enum: ['createdAt', 'rating'] })
  @IsOptional()
  @IsIn(['createdAt', 'rating'])
  orderBy?: 'createdAt' | 'rating';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';
}