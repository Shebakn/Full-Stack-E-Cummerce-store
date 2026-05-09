import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/user/dto/user-response.dto';

export class MyProfileResponseDto extends UserResponseDto {
  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  age: number;
}
