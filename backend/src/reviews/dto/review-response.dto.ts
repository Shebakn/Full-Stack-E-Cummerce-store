import { Expose, Type } from 'class-transformer';

export class ReviewUserDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
}

export class ReviewResponseDto {
  @Expose()
  id!: string;

  @Expose()
  reviewText?: string;

  @Expose()
  rating!: number;

  @Expose()
  productId!: string;

  @Expose()
  @Type(() => ReviewUserDto)
  user!: ReviewUserDto;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}