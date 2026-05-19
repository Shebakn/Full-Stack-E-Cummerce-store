import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ErrorCodes } from '@/common/errors/error-codes';
import { BaseException } from '@/common/exceptions/base.exception';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateCountryDto) {
    const existing = await this.prisma.country.findFirst({
      where: {
        OR: [{ name: dto.name }, { code: dto.code }],
      },
    });

    if (existing) {
      throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
    }

    return this.prisma.country.create({
      data: {
        name: dto.name,
        code: dto.code,
        isActive: dto.isActive ?? true,
      },
    });
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(query: QueryCountryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(query.name && {
        name: {
          contains: query.name,
          mode: 'insensitive',
        },
      }),
      ...(query.code && {
        code: {
          contains: query.code,
          mode: 'insensitive',
        },
      }),
      ...(query.isActive !== undefined && {
        isActive: query.isActive,
      }),
    };

    const orderBy = [
      query.sortByCreatedAt && { createdAt: query.sortByCreatedAt },
    ].filter(Boolean) as any;

    const [data, total] = await Promise.all([
      this.prisma.country.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.country.count({ where }),
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

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: {
        regions: true,
      },
    });

    if (!country) {
      throw new BaseException(ErrorCodes.COUNTRY_NOT_FOUND, 404);
    }

    return country;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: string, dto: UpdateCountryDto) {
  await this.findOne(id);

  if (dto.name || dto.code) {
    const orConditions: any[] = [];

    if (dto.name) {
      orConditions.push({ name: dto.name });
    }

    if (dto.code) {
      orConditions.push({ code: dto.code });
    }

    const duplicate = await this.prisma.country.findFirst({
      where: {
        OR: orConditions,
        NOT: { id },
      },
    });

    if (duplicate) {
      throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
    }
  }

  return this.prisma.country.update({
    where: { id },
    data: dto,
  });
}

  // =========================
  // DELETE
  // =========================
  async remove(id: string) {
    await this.findOne(id);

    const hasRegions = await this.prisma.region.findFirst({
      where: { countryId: id },
    });

    if (hasRegions) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 409);
    }

    return this.prisma.country.delete({
      where: { id },
    });
  }

  // =========================
  // TOGGLE STATUS
  // =========================
  async toggleStatus(id: string) {
    const country = await this.findOne(id);

    return this.prisma.country.update({
      where: { id },
      data: {
        isActive: !country.isActive,
      },
    });
  }

  // =========================
  // ACTIVE ONLY
  // =========================
  async findActive() {
    return this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}