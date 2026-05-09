import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  url!: string;

  @ApiProperty()
  @Expose()
  isCover!: boolean;

  @ApiProperty()
  @Expose()
  position!: number;

  @ApiProperty()
  @Expose()
  productId!: string;

  @ApiProperty()
  @Expose()
  createdAt!: Date;
}