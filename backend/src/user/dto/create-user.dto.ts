import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNumber,
  Length,
  IsBoolean,
  Matches,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Role } from '@/common/enums/role.enum';
import { Gender } from '@/common/enums/gender.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', minLength: 3, maxLength: 30 })
  @IsString()
  @Length(3, 30)
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPass123', minLength: 3, maxLength: 20 })
  @IsString()
  @Length(3, 20)
  password!: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({ required: false, example: 'https://avatar.png' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false, example: 25 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    required: false,
    example: '01012345678',
    description: 'Egyptian phone number',
  })
  @IsOptional()
  @Matches(/^01[0125][0-9]{8}$/)
  phoneNumber?: string;

  @ApiProperty({ required: false, example: 'Cairo, Egypt' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ required: false, example: '123456' })
  @IsOptional()
  @IsString()
  verificationCode?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}