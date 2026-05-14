import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCodes } from '@/common/errors/error-codes';

import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/upate-cart-item.dto';

// Prisma types
import { Prisma, Cart, CartItem, Product, ProductVariant } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // GET OR CREATE CART
  // =========================================================
  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  // =========================================================
  // GET CART
  // =========================================================
  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const data = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imageCover: true,
              },
            },
            variant: {
              select: {
                id: true,
                attributes: true,
              },
            },
          },
        },
        coupon: true,
      },
    });

    return this.mapCart(data);
  }

  // =========================================================
  // ADD ITEM (STRICT - NO DUPLICATES)
  // =========================================================
  async addItem(userId: string, dto: CreateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    // =========================
    // PRODUCT
    // =========================
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: {
        variants: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      throw new BaseException(ErrorCodes.NOT_FOUND, 404);
    }

    const hasVariants = product.variants.length > 0;

    // =========================
    // VARIANT RULE
    // =========================
    if (hasVariants && !dto.variantId) {
      throw new BaseException(
        ErrorCodes.INVALID_DATA,
        400,
        'Variant is required for this product',
      );
    }

    if (!hasVariants && dto.variantId) {
      throw new BaseException(
        ErrorCodes.INVALID_DATA,
        400,
        'This product has no variants',
      );
    }

    // =========================
    // VARIANT
    // =========================
    let variant: ProductVariant | null = null;
    let unitPrice = product.price;
    let stock = product.stock;

    if (dto.variantId) {
      variant = await this.prisma.productVariant.findUnique({
        where: { id: dto.variantId },
      });

      if (!variant) {
        throw new BaseException(ErrorCodes.NOT_FOUND, 404);
      }

      if (variant.productId !== product.id) {
        throw new BaseException(
          ErrorCodes.INVALID_DATA,
          400,
          'Variant does not belong to product',
        );
      }

      unitPrice = variant.price;
      stock = variant.stock;
    }

    // =========================
    // 🔥 STRICT: CHECK EXISTING
    // =========================
    const existing = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId ?? null,
      },
    });

    if (existing) {
      throw new BaseException(
        ErrorCodes.INVALID_DATA,
        400,
        'Item already exists in cart',
      );
    }

    // =========================
    // STOCK CHECK
    // =========================
    if (dto.quantity > stock) {
      throw new BaseException(
        ErrorCodes.INVALID_DATA,
        400,
        `Only ${stock} available`,
      );
    }

    // =========================
    // CREATE
    // =========================
    await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        variantId: variant?.id ?? null,
        quantity: dto.quantity,
        unitPrice, // ✅ snapshot
      },
    });

    return this.getCart(userId);
  }

  // =========================================================
  // UPDATE ITEM (WITH STOCK CHECK)
  // =========================================================
  async updateItem(itemId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: true,
        variant: true,
        cart: true,
      },
    });

    if (!item) {
      throw new BaseException(ErrorCodes.NOT_FOUND, 404);
    }

    const stock = item.variant?.stock ?? item.product.stock;

    if (dto.quantity > stock) {
      throw new BaseException(
        ErrorCodes.INVALID_DATA,
        400,
        `Only ${stock} available`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: dto.quantity,
      },
    });

    return this.getCart(item.cart.userId);
  }

  // =========================================================
  // REMOVE ITEM
  // =========================================================
  async removeItem(itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) {
      throw new BaseException(ErrorCodes.NOT_FOUND, 404);
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(item.cart.userId);
  }

  // =========================================================
  // CLEAR CART
  // =========================================================
  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCart(userId);
  }

  // =========================================================
  // APPLY COUPON
  // =========================================================
  async applyCoupon(userId: string, couponId: string) {
    const cart = await this.getOrCreateCart(userId);

    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon || !coupon.isActive) {
      throw new BaseException(ErrorCodes.INVALID_COUPON, 400);
    }

    if (coupon.expiryDate < new Date()) {
      throw new BaseException(ErrorCodes.INVALID_COUPON, 400);
    }

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponId },
    });

    return this.getCart(userId);
  }

  // =========================================================
  // REMOVE COUPON
  // =========================================================
  async removeCoupon(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponId: null },
    });

    return this.getCart(userId);
  }

  // =========================================================
  // MAPPER
  // =========================================================
  private mapCart(cart: any) {
    let subtotal = 0;

    const items = cart.cartItems.map((i: any) => {
      const total = i.unitPrice * i.quantity;
      subtotal += total;

      return {
        id: i.id,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        total,

        product: {
          id: i.product.id,
          title: i.product.title,
          imageCover: i.product.imageCover,
        },

        variant: i.variant
          ? {
              id: i.variant.id,
              attributes: i.variant.attributes,
            }
          : null,
      };
    });

    let discount = 0;

    if (cart.coupon) {
      discount =
        cart.coupon.type === 'PERCENTAGE'
          ? (subtotal * cart.coupon.value) / 100
          : cart.coupon.value;
    }

    return {
      id: cart.id,
      userId: cart.userId,

      items,

      summary: {
        subtotal,
        discount,
        total: subtotal - discount,
      },

      couponId: cart.couponId,
    };
  }
}