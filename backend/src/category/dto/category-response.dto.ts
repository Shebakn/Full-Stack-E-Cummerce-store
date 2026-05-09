import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  image?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  parentId?: string | null;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  // =========================
  // TREE SUPPORT
  // =========================
  @ApiProperty({
    type: () => [CategoryResponseDto],
    required: false,
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  children?: CategoryResponseDto[];
}