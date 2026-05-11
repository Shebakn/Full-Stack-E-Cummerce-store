import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductImageDto {
  @ApiPropertyOptional({ example: 'https://image-url.com/img.png' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isCover?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  position?: number;
}