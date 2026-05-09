import {
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderProductImageItemDto {
  @ApiProperty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsInt()
  position!: number;
}

export class ReorderProductImagesDto {
  @ApiProperty({ type: [ReorderProductImageItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderProductImageItemDto)
  items!: ReorderProductImageItemDto[];
}