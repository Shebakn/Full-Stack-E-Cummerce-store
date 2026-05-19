import { IsString, Length, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ example: 'Saudi Arabia', minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  name!: string;

  @ApiProperty({ example: 'SA', description: 'ISO country code' })
  @IsString()
  @Length(2, 5)
  @Matches(/^[A-Z]{2,5}$/)
  code!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}