import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";
import { BaseException } from "@/common/exceptions/base.exception";
import { ErrorCodes } from "@/common/errors/error-codes";

import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { QueryRegionDto } from "./dto/query-region.dto";

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateRegionDto) {
    const existing = await this.prisma.region.findFirst({
      where: {
        name: dto.name,
        countryId: dto.countryId,
      },
    });

    if (existing) {
      throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
    }

    return this.prisma.region.create({
      data: {
        name: dto.name,
        countryId: dto.countryId,
      },
    });
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(query: QueryRegionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(query.countryId && { countryId: query.countryId }),
      ...(query.search && {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      }),
    };

    const orderBy = [
      query.sortByCreatedAt && { createdAt: query.sortByCreatedAt },
    ].filter(Boolean) as any;

    const [data, total] = await Promise.all([
      this.prisma.region.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          country: true, // optional relation
          _count: {
            select: {
              centers: true,
            },
          },
        },
      }),
      this.prisma.region.count({ where }),
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
    const region = await this.prisma.region.findUnique({
      where: { id },
      include: {
        country: true,
        centers: true,
      },
    });

    if (!region) {
      throw new BaseException(ErrorCodes.REGION_NOT_FOUND, 404);
    }

    return region;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: string, dto: UpdateRegionDto) {
    await this.findOne(id);

    if (dto.name || dto.countryId) {
      const duplicate = await this.prisma.region.findFirst({
        where: {
          name: dto.name ?? undefined,
          countryId: dto.countryId ?? undefined,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
      }
    }

    return this.prisma.region.update({
      where: { id },
      data: dto,
    });
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: string) {
    await this.findOne(id);

    const hasCenters = await this.prisma.deliveryCenter.findFirst({
      where: { regionId: id },
    });

    if (hasCenters) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 409);
    }

    return this.prisma.region.delete({
      where: { id },
    });
  }

  // =========================
  // GET BY COUNTRY
  // =========================
  async getByCountry(countryId: string) {
    return this.prisma.region.findMany({
      where: { countryId },
      orderBy: { createdAt: "asc" },
    });
  }
}