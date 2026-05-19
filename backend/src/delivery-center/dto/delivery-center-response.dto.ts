import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryCenterResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  address!: string | null;

  @ApiProperty()
  @Expose()
  latitude!: number;

  @ApiProperty()
  @Expose()
  longitude!: number;

  @ApiProperty()
  @Expose()
  phone!: string | null;

  @ApiProperty()
  @Expose()
  isActive!: boolean;

  @ApiProperty()
  @Expose()
  regionId!: string;

  @ApiProperty()
  @Expose()
  deliveryFee!: number;

  @ApiProperty()
  @Expose()
  etaMinutes!: number | null;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}