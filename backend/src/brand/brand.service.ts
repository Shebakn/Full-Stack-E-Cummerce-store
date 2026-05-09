import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { QueryBrandDto } from './dto/query-brand.dto';
import { ErrorCodes } from '@/common/errors/error-codes';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateBrandDto) {
    const existing = await this.prisma.brand.findFirst({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException({
        code: ErrorCodes.DB_DUPLICATE,
        message: 'Brand already exists',
      });
    }

    return this.prisma.brand.create({
      data: dto,
    });
  }

  // =========================
  // FIND ALL (REST FULL)
  // =========================
  async findAll(query: QueryBrandDto) {
    const take = query.limit ?? 10;
    const page = query.page ?? 1;
    const skip = (page - 1) * take;

    const where = {
      ...(query.search && {
        name: {
          contains: query.search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({
        where,
        take,
        skip,
        orderBy: {
          createdAt: query.sortByCreatedAt ?? 'desc',
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data,
      meta: {
        message: 'Brands fetched successfully',
        pagination: {
          page,
          limit: take,
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    };
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException({
        code: ErrorCodes.USER_NOT_FOUND,
        message: 'Brand not found',
      });
    }

    return brand;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.brand.findFirst({
        where: {
          name: dto.name,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException({
          code: ErrorCodes.DB_DUPLICATE,
          message: 'Brand name already exists',
        });
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: dto,
    });
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.brand.delete({
      where: { id },
    });
  }
}