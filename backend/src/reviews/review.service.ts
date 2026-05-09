import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // CREATE REVIEW
  // =========================================================
  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.review.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      throw new BadRequestException('You already reviewed this product');
    }

    const review = await this.prisma.review.create({
      data: {
        reviewText: dto.reviewText,
        rating: dto.rating,
        userId,
        productId,
      },
    });

    await this.updateProductRating(productId);

    return review;
  }

  // =========================================================
  // GET REVIEWS (FILTER + PAGINATION + SORT)
  // =========================================================
  async findAll(query: QueryReviewDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.productId && { productId: query.productId }),
      ...(query.userId && { userId: query.userId }),
      ...(query.rating && { rating: query.rating }),

      ...(query.search && {
        reviewText: {
          contains: query.search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const orderBy = {
      [query.orderBy ?? 'createdAt']: query.orderDirection ?? 'desc',
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              // avatar: true (if exists)
            },
          },
        },
      }),

      this.prisma.review.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // GET REVIEWS BY PRODUCT
  // =========================================================
  async findByProduct(productId: string, query?: QueryReviewDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      productId,
      ...(query?.rating && { rating: query.rating }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.review.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // UPDATE REVIEW
  // =========================================================
  async update(reviewId: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You cannot edit this review');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });

    await this.updateProductRating(review.productId);

    return updated;
  }

  // =========================================================
  // DELETE REVIEW
  // =========================================================
  async remove(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You cannot delete this review');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    await this.updateProductRating(review.productId);

    return { message: 'Review deleted successfully' };
  }

  // =========================================================
  // UPDATE PRODUCT RATING (AVG + COUNT)
  // =========================================================
  private async updateProductRating(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingsAverage: stats._avg.rating ?? 0,
        ratingsQuantity: stats._count.rating ?? 0,
      },
    });
  }
}