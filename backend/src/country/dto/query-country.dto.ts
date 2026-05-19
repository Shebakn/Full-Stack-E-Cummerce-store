import { IsOptional, IsString, IsBoolean, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCountryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ example: 'Saudi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'SA' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByCreatedAt?: 'asc' | 'desc';
}