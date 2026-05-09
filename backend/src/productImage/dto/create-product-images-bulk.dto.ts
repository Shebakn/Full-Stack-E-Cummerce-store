import {
  IsArray,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductImageDto } from './create-product-image.dto'; 

export class CreateProductImagesBulkDto {
  @ApiProperty({ type: [CreateProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images!: CreateProductImageDto[];
}