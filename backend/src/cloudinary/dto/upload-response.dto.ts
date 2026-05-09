import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v123/products/image.png',
  })
  @Expose()
  url!: string;

  @ApiProperty({
    example: 'products/abc123image',
  })
  @Expose()
  publicId!: string;
}