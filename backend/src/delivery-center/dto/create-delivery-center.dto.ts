import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliveryCenterDto {
  @ApiProperty({ example: 'Riyadh Central Hub' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Olaya Street, Riyadh' })
  @IsOptional()
  @IsString()
  address?: string;

  // =========================
  // GEO LOCATION
  // =========================
  @ApiProperty({ example: 24.7136 })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: 46.6753 })
  @IsNumber()
  longitude!: number;

  // =========================
  // CONTACT
  // =========================
  @ApiPropertyOptional({ example: '+966500000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  // =========================
  // RELATION
  // =========================
  @ApiProperty({ example: 'uuid-region-id' })
  @IsUUID()
  regionId!: string;

  // =========================
  // DELIVERY INFO
  // =========================
  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @ApiPropertyOptional({ example: 30, description: 'ETA in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  etaMinutes?: number;

  // =========================
  // STATUS
  // =========================
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}