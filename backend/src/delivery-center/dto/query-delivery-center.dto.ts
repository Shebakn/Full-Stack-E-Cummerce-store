import {
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsBoolean,
  IsIn,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDeliveryCenterDto {
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
  // FILTERS
  // =========================
  @ApiPropertyOptional({ example: 'region-uuid' })
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 24.7136 })
@IsOptional()
@IsNumber()
lat?: number;

@ApiPropertyOptional({ example: 46.6753 })
@IsOptional()
@IsNumber()
lng?: number;

  // =========================
  // SORTING
  // =========================
  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByCreatedAt?: 'asc' | 'desc';
}