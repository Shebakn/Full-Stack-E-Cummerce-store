import {
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCodes } from '@/common/errors/error-codes';

import { CreateDeliveryCenterDto } from './dto/create-delivery-center.dto';
import { UpdateDeliveryCenterDto } from './dto/update-delivery-center.dto';
import { QueryDeliveryCenterDto } from './dto/query-delivery-center.dto';

@Injectable()
export class DeliveryCenterService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateDeliveryCenterDto) {
    // ✅ region exists
    const region = await this.prisma.region.findUnique({
      where: { id: dto.regionId },
    });

    if (!region) {
      throw new BaseException(ErrorCodes.NOT_FOUND, 404);
    }

    // ✅ duplicate check (name داخل نفس region)
    const duplicate = await this.prisma.deliveryCenter.findFirst({
      where: {
        name: dto.name,
        regionId: dto.regionId,
      },
    });

    if (duplicate) {
      throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
    }

    // geo validation (optional sanity)
    this.validateCoordinates(dto.latitude, dto.longitude);

    return this.prisma.deliveryCenter.create({
      data: dto,
    });
  }

  // =========================
  // FIND ALL (WITH NEAREST)
  // =========================
  async findAll(query: QueryDeliveryCenterDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(query.regionId && { regionId: query.regionId }),
      ...(query.isActive !== undefined && {
        isActive: query.isActive,
      }),
    };

    const orderBy = {
      createdAt: query.sortByCreatedAt ?? 'desc',
    };

    // =========================
    //  NEAREST LOGIC
    // =========================
    if (query.lat !== undefined && query.lng !== undefined) {
      const centers = await this.prisma.deliveryCenter.findMany({
        where,
      });

      const withDistance = centers.map((c) => ({
        ...c,
        distance: this.calculateDistance(
          query.lat!,
          query.lng!,
          c.latitude,
          c.longitude,
        ),
      }));

      const sorted = withDistance.sort(
        (a, b) => a.distance - b.distance,
      );

      return {
        data: sorted,
        meta: null,
      };
    }

    // =========================
    // NORMAL PAGINATION
    // =========================
    const [data, total] = await Promise.all([
      this.prisma.deliveryCenter.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.deliveryCenter.count({ where }),
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
    const center = await this.prisma.deliveryCenter.findUnique({
      where: { id },
    });

    if (!center) {
      throw new BaseException(ErrorCodes.NOT_FOUND, 404);
    }

    return center;
  }

  // =========================
// 🔥 FIND NEAREST (SEPARATE)
// =========================
async findNearest(query: QueryDeliveryCenterDto) {
  if (query.lat === undefined || query.lng === undefined) {
    throw new BaseException(ErrorCodes.VALIDATION_ERROR, 400);
  }

  const where: any = {
    ...(query.regionId && { regionId: query.regionId }),
    ...(query.isActive !== undefined && {
      isActive: query.isActive,
    }),
  };

  const centers = await this.prisma.deliveryCenter.findMany({
    where,
  });

  const withDistance = centers.map((c) => ({
    ...c,
    distance: this.calculateDistance(
      query.lat!,
      query.lng!,
      c.latitude,
      c.longitude,
    ),
  }));

  return withDistance.sort((a, b) => a.distance - b.distance);
}

  // =========================
  // UPDATE
  // =========================
  async update(id: string, dto: UpdateDeliveryCenterDto) {
    await this.findOne(id);

    if (dto.regionId) {
      const region = await this.prisma.region.findUnique({
        where: { id: dto.regionId },
      });

      if (!region) {
        throw new BaseException(ErrorCodes.NOT_FOUND, 404);
      }
    }

    if (dto.name) {
      const duplicate = await this.prisma.deliveryCenter.findFirst({
        where: {
          name: dto.name,
          regionId: dto.regionId,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
      }
    }

    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      this.validateCoordinates(dto.latitude, dto.longitude);
    }

    return this.prisma.deliveryCenter.update({
      where: { id },
      data: dto,
    });
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.deliveryCenter.delete({
      where: { id },
    });
  }

  // =========================
  // PRIVATE: VALIDATE GEO
  // =========================
  private validateCoordinates(lat: number, lng: number) {
    if (lat < -90 || lat > 90) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (lng < -180 || lng > 180) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 400);
    }
  }

  // =========================
  // 🔥 HAVERSINE DISTANCE
  // =========================
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // km
  }
}