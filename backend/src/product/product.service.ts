import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma, ProductImage, ProductVariant } from '@prisma/client';

import { ErrorCodes } from '@/common/errors/error-codes';
import { BaseException } from '@/common/exceptions/base.exception';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // =========================================================
  // CREATE PRODUCT
  // =========================================================
  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BaseException(
        ErrorCodes.CATEGORY_NOT_FOUND,
        404,
      );
    }

    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });

      if (!brand) {
        throw new BaseException(
          ErrorCodes.BRAND_NOT_FOUND,
          404,
        );
      }
    }

    let image = dto.imageCover;

    if (file) {
      const uploaded = await this.cloudinary.uploadImage(file, 'products');
      image = uploaded.url;
    }

    if (!image) {
      throw new BadRequestException('Image is required');
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        imageCover: image,
      },
    });
  }

  // =========================================================
  // FIND ALL PRODUCTS (FIXED RELATIONS)
  // =========================================================
  async findAll(query: QueryProductDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  // ================= CATEGORY TREE =================
let categoryIds: string[] | undefined;

if (query.categoryId) {
  // single category (with optional children)
  if (query.includeChildren) {
    categoryIds = await this.getCategoryTreeIds(query.categoryId);
  } else {
    categoryIds = [query.categoryId];
  }
} 
else if (query.categoryIds?.length) {
  // MULTI SELECT FROM FRONTEND
  if (query.includeChildren) {
    // expand each category with children
    const expanded = await Promise.all(
      query.categoryIds.map((id) =>
        this.getCategoryTreeIds(id),
      ),
    );

    categoryIds = [...new Set(expanded.flat())];
  } else {
    categoryIds = query.categoryIds;
  }
}

  // ================= PRICE FILTER =================
  const priceFilter =
    query.minPrice !== undefined || query.maxPrice !== undefined
      ? {
          ...(query.minPrice !== undefined && {
            gte: query.minPrice,
          }),
          ...(query.maxPrice !== undefined && {
            lte: query.maxPrice,
          }),
        }
      : undefined;

  // ================= WHERE =================
  const where: Prisma.ProductWhereInput = {
    ...(query.search && {
      OR: [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ],
    }),

    ...(query.brandId && {
      brandId: query.brandId,
    }),

    ...(categoryIds?.length && {
      categoryId: { in: categoryIds },
    }),

    ...(priceFilter && {
      price: priceFilter,
    }),

    ...(query.ratings?.length && {
      ratingsAverage: {
        in: query.ratings,
      },
    }),
  };

  // ================= QUERY =================
  const [data, total] = await this.prisma.$transaction([
    this.prisma.product.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        [query.orderBy ?? 'createdAt']:
          query.orderDirection ?? 'desc',
      },

      include: {
        category: {
          select: { id: true, name: true },
        },
        brand: true,
        images: {
          orderBy: { position: 'asc' },
        },
        variants: {
          include: {
            attributes: true,
          },
        },
        reviews: true,
        _count: {
          select: { reviews: true },
        },
      },
    }),

    this.prisma.product.count({ where }),
  ]);

  // ================= RESPONSE =================
  return {
    data: data.map((p) => this.mapProduct(p)),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
  // =========================================================
  // FIND ONE PRODUCT (🔥 FIXED FULL RELATIONS)
  // =========================================================
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,

        images: {
          orderBy: { position: 'asc' },
        },

        variants: {
          include: {
            attributes: true,
          },
        },

        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },

        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new BaseException(
        ErrorCodes.PRODUCT_NOT_FOUND,
        404,
      );
    }

    return this.mapProduct(product);
  }

  // =========================================================
  // MAPPER (CLEAN RESPONSE)
  // =========================================================
  private mapProduct(p: any) {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: Number(p.price),

      imageCover: this.transform(p.imageCover),

      sold: p.sold,
      ratingsAverage: p.ratingsAverage,
      ratingsQuantity: p._count?.reviews ?? 0,

      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
          }
        : null,

      brand: p.brand ?? null,

      images: p.images?.map((img: ProductImage) => ({
        id: img.id,
        isCover: img.isCover,
        position: img.position,
        url: this.transform(img.url),
      })),

      variants: p.variants?.map((v: ProductVariant) => ({
        id: v.id,
        sku: v.sku,
        price: Number(v.price),
        stock: v.stock,

        // attributes: v.attributes,
      })),

      reviews: p.reviews ?? [],
    };
  }

  // =========================================================
  // IMAGE TRANSFORM
  // =========================================================
  private transform(url: string) {
    if (!url) return null;

    return {
      original: url,
      small: url.replace('/upload/', '/upload/w_300,q_auto/'),
      medium: url.replace('/upload/', '/upload/w_600,q_auto/'),
      large: url.replace('/upload/', '/upload/w_1200,q_auto/'),
    };
  }

  // =========================
// UPDATE PRODUCT
// =========================
async update(
  id: string,
  dto: UpdateProductDto, // أو UpdateProductDto إذا عندك لاحقًا
  file?: Express.Multer.File,
) {
  const product = await this.prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new BaseException(ErrorCodes.PRODUCT_NOT_FOUND, 404);
  }

  if (dto.categoryId) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BaseException(ErrorCodes.CATEGORY_NOT_FOUND, 404);
    }
  }

  if (dto.brandId) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: dto.brandId },
    });

    if (!brand) {
      throw new BaseException(ErrorCodes.BRAND_NOT_FOUND, 404);
    }
  }

  let image = dto.imageCover;

  if (file) {
    const uploaded = await this.cloudinary.uploadImage(file, 'products');
    image = uploaded.url;
  }

  return this.prisma.product.update({
    where: { id },
    data: {
      ...dto,
      ...(image && { imageCover: image }),
    },
    include: {
      category: true,
      brand: true,
      images: true,
      variants: {
        include: {
          attributes: true,
        },
      },
      reviews: true,
      _count: {
        select: { reviews: true },
      },
    },
  });
}

// =========================
// DELETE PRODUCT
// =========================
async remove(id: string) {
  const product = await this.prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new BaseException(ErrorCodes.PRODUCT_NOT_FOUND, 404);
  }

  // Prisma cascade will handle relations (images, variants, reviews)
  return this.prisma.product.delete({
    where: { id },
  });
}

private async getCategoryTreeIds(rootId: string): Promise<string[]> {
  const allCategories = await this.prisma.category.findMany({
    select: {
      id: true,
      parentId: true,
    },
  });

  const map = new Map<string, string[]>();

  for (const cat of allCategories) {
    if (cat.parentId) {
      if (!map.has(cat.parentId)) {
        map.set(cat.parentId, []);
      }
      map.get(cat.parentId)!.push(cat.id);
    }
  }

  const result: string[] = [];

  const dfs = (id: string) => {
    result.push(id);

    const children = map.get(id) || [];
    for (const childId of children) {
      dfs(childId);
    }
  };

  dfs(rootId);

  return result;
}

}