import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VariantAttributeDto {
  @ApiProperty({
    example: 'color',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'black',
  })
  @IsString()
  value!: string;
}