import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// =========================
// User DTO
// =========================
export class UserDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  role!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  avatar!: string | null;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}

// =========================
// Auth Response DTO
// =========================
export class AuthResponseDto {
  @ApiProperty({ type: () => UserDto })
  @Type(() => UserDto)
  @Expose()
  user!: UserDto;

  @ApiProperty()
  @Expose()
  accessToken!: string;
}