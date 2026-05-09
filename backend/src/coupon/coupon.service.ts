import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { QueryCouponDto } from './dto/query-coupon.dto';

@Injectable()
export class CouponService {

  constructor(private readonly prisma: PrismaService){}

  /**
   * Create new category
   */
  async create(createCouponDto: CreateCouponDto) {
    // check name if exists
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        code: createCouponDto.code,
      },
    });

    if (coupon) {
      throw new BadRequestException('Coupon already exists');
    }

    return this.prisma.coupon.create({
      data: createCouponDto,
    });
  }

  /**
   * Get all coupons
   */
  async findAll(query: QueryCouponDto) {
  const {
    page,
    limit,
    code,
    type,
    isActive,
    orderBy,
    sort,
  } = query;

  const take = limit ?? 10;
  const currentPage = page ?? 1;
  const skip = (currentPage - 1) * take;

  const [coupons, total] = await Promise.all([
    this.prisma.coupon.findMany({
      skip,
      take,

      where: {
        code: code
          ? { contains: code, mode: 'insensitive' }
          : undefined,

        type: type ?? undefined,

        isActive: isActive ?? undefined,
      },


      orderBy: orderBy
        ? {
            [orderBy]: sort ?? 'desc',
          }
        : {
            createdAt: 'desc',
          },
    }),

    this.prisma.coupon.count({
      where: {
        code: code
          ? { contains: code, mode: 'insensitive' }
          : undefined,
        type: type ?? undefined,
        isActive: isActive ?? undefined,
      },
    }),
  ]);

  return {
    data: coupons,
    meta: {
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
}

  /**
   * Get one coupon
   */
  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    return coupon;
  }

  /**
   * update coupon by id
   */
  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    return this.prisma.coupon.update({
      where: {
        id,
      },
      data: updateCouponDto,
    });
  }

  /**
   * Delete coupon
   */
  async remove(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    return this.prisma.coupon.delete({
      where: {
        id,
      },
    });
  }
}

