import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductImageDto {
  @ApiPropertyOptional({ example: 'https://new-url.com/img.png' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isCover?: boolean;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  position?: number;
}