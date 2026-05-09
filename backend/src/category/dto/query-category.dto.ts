import { Type, Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Min,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCategoryDto {
  // =========================
  // PAGINATION
  // =========================
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

  // =========================
  // SEARCH
  // =========================
  @ApiPropertyOptional({
    example: 'electro',
    description: 'Search by category name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // =========================
  // SORTING
  // =========================
  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort by createdAt',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderByCreatedAt?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 'asc',
    enum: ['asc', 'desc'],
    description: 'Sort by name',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderByName?: 'asc' | 'desc';

  // =========================
  // INCLUDE CHILDREN 🔥
  // =========================
  @ApiPropertyOptional({
    example: true,
    description: 'Include nested children categories',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeChildren?: boolean;
}