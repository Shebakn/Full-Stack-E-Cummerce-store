import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { ErrorCodes } from '@/common/errors/error-codes';
import { BaseException } from '@/common/exceptions/base.exception';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: {
        name: dto.name,
        parentId: dto.parentId ?? null,
      },
    });

    if (existing) {
      throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        image: dto.image,
        parentId: dto.parentId ?? null,
      },
    });
  }

  // =========================
  // FIND ALL (🔥 FIXED LOGIC)
  // =========================
  async findAll(query: QueryCategoryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: any = {
    parentId: null, // ✅ فقط الروت
    ...(query.search && {
      name: {
        contains: query.search,
        mode: 'insensitive',
      },
    }),
  };

  const orderBy = [
    query.orderByName && { name: query.orderByName },
    { createdAt: query.orderByCreatedAt ?? 'asc' },
  ].filter(Boolean) as any;

  // =========================
  // WITHOUT CHILDREN (DEFAULT)
  // =========================
  if (!query.includeChildren) {
    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.category.count({ where }),
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
  // WITH CHILDREN (TREE)
  // =========================
  const categories = await this.prisma.category.findMany({
    orderBy,
  });

  const tree = this.buildTree(categories);

  return {
    data: tree,
    meta: null, // ❌ ما فيه pagination هنا
  };
}

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      throw new BaseException(ErrorCodes.CATEGORY_NOT_FOUND, 404);
    }

    return category;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.parentId === id) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (dto.name) {
      const duplicate = await this.prisma.category.findFirst({
        where: {
          name: dto.name,
          parentId: dto.parentId ?? null,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new BaseException(ErrorCodes.DB_DUPLICATE, 409);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: string) {
    await this.findOne(id);

    const hasChildren = await this.prisma.category.findFirst({
      where: { parentId: id },
    });

    if (hasChildren) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 409);
    }

    const hasProducts = await this.prisma.product.findFirst({
      where: { categoryId: id },
    });

    if (hasProducts) {
      throw new BaseException(ErrorCodes.VALIDATION_ERROR, 409);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  // =========================
  // ROOTS
  // =========================
  async getRoots() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  // =========================
  // CHILDREN
  // =========================
  async getChildren(parentId: string) {
    return this.prisma.category.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // =========================
  // PATH (BREADCRUMBS)
  // =========================
  async getPath(id: string) {
    const path: any[] = [];

    let current = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!current) {
      throw new BaseException(ErrorCodes.CATEGORY_NOT_FOUND, 404);
    }

    while (current) {
      path.unshift(current);

      if (!current.parentId) break;

      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
      });
    }

    return path;
  }

  // =========================
  // TREE BUILDER 🔥
  // =========================
  private buildTree(categories: any[]) {
    const map = new Map<string, any>();
    const roots: any[] = [];

    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    categories.forEach((cat) => {
      const node = map.get(cat.id);

      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}