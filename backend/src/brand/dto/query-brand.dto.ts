import {
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBrandDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ example: 'apple' })
  @IsOptional()
  @IsString()
  search?: string;

  // =========================
  // SORT (NEW)
  // =========================
  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByCreatedAt?: 'asc' | 'desc';
}