import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductVariantsDto } from './dto/create-product-varients.dto';
import { UpdateProductVariantDto } from './dto/update-varient.dto';

@Injectable()
export class ProductVariantService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // CREATE VARIANTS + SYNC PRODUCT PRICE/STOCK
  // =========================================================
  async create(productId: string, dto: CreateProductVariantsDto) {
    if (!dto.variants?.length) {
      throw new BadRequestException('Variants are required');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create variants
      const created = await Promise.all(
        dto.variants.map((variant) =>
          tx.productVariant.create({
            data: {
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
              productId,
              attributes: {
                create: variant.attributes.map((attr) => ({
                  name: attr.name,
                  value: attr.value,
                })),
              },
            },
            include: { attributes: true },
          }),
        ),
      );

      // 2. Recalculate product price (min variant price)
      const allVariants = await tx.productVariant.findMany({
        where: { productId },
        select: {
          price: true,
          stock: true,
        },
      });

      const prices = allVariants.map((v) => Number(v.price));
      const stocks = allVariants.map((v) => v.stock);

      await tx.product.update({
        where: { id: productId },
        data: {
          price: Math.min(...prices),
          stock: stocks.reduce((a, b) => a + b, 0),
        },
      });

      return created;
    });

    return result;
  }

  // =========================================================
  // GET VARIANTS BY PRODUCT
  // =========================================================
  async findByProduct(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
      include: {
        attributes: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // =========================================================
  // GET SINGLE VARIANT
  // =========================================================
  async findOne(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        attributes: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant;
  }

  // =========================================================
  // UPDATE VARIANT + SYNC PRODUCT
  // =========================================================
  async update(id: string, dto: UpdateProductVariantDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const updated = await this.prisma.productVariant.update({
      where: { id },
      data: {
        sku: dto.sku,
        price: dto.price,
        stock: dto.stock,
      },
    });

    await this.syncProductStats(variant.productId);

    return updated;
  }

  // =========================================================
  // DELETE VARIANT + SYNC PRODUCT
  // =========================================================
  async remove(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    await this.prisma.productVariant.delete({
      where: { id },
    });

    await this.syncProductStats(variant.productId);

    return { success: true };
  }

  // =========================================================
  // UPDATE STOCK ONLY
  // =========================================================
  async updateStock(id: string, stock: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const updated = await this.prisma.productVariant.update({
      where: { id },
      data: { stock },
    });

    await this.syncProductStats(variant.productId);

    return updated;
  }

  // =========================================================
  // BUSINESS LOGIC: SYNC PRODUCT PRICE & STOCK
  // =========================================================
  private async syncProductStats(productId: string) {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      select: {
        price: true,
        stock: true,
      },
    });

    if (!variants.length) return;

    const prices = variants.map((v) => Number(v.price));
    const stocks = variants.map((v) => v.stock);

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        price: Math.min(...prices),
        stock: stocks.reduce((a, b) => a + b, 0),
      },
    });
  }
}