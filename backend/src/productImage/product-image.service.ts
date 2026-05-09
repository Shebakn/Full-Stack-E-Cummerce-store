import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

import { CreateProductImagesBulkDto } from './dto/create-product-images-bulk.dto'; 
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ReorderProductImagesDto } from './dto/reorder-image.dto';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCodes } from '@/common/errors/error-codes';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // =========================================================
  // ADD MULTIPLE IMAGES (URL or FILE)
  // =========================================================
  async addImages(
    productId: string,
    dto?: CreateProductImagesBulkDto,
    files?: Express.Multer.File[],
  ) {
    await this.ensureProductExists(productId);

    let images: any[] = [];

    // ================= FILES =================
    if (files?.length) {
      const uploaded = await Promise.all(
        files.map((file) =>
          this.cloudinary.uploadImage(file, 'products'),
        ),
      );

      images = uploaded.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        isCover: false,
        position: index,
      }));
    }

    // ================= URL DTO =================
    if (dto?.images?.length) {
      images = dto.images.map((img, index) => ({
        url: img.url,
        isCover: img.isCover ?? false,
        position: img.position ?? index,
      }));
    }

    if (!images.length) {
      throw new BaseException(ErrorCodes.FILE_REQUIRED, 400);
    }

    // ================= POSITION FIX =================
    const last = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { position: 'desc' },
    });

    let start = last ? last.position + 1 : 0;

    images = images.map((img, i) => ({
      ...img,
      position: img.position ?? start + i,
    }));

    // ================= COVER LOGIC =================
    const hasCover = images.some((i) => i.isCover);

    if (hasCover) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isCover: false },
      });
    }

    await this.prisma.productImage.createMany({
      data: images.map((img) => ({
        ...img,
        productId,
      })),
    });

    return this.findByProduct(productId);
  }

  // =========================================================
  // GET PRODUCT IMAGES
  // =========================================================
  async findByProduct(productId: string) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { position: 'asc' },
    });
  }

  // =========================================================
  // UPDATE IMAGE
  // =========================================================
  async updateImage(id: string, dto: UpdateProductImageDto) {
    const image = await this.ensureImageExists(id);

    if (dto.isCover === true) {
      await this.prisma.productImage.updateMany({
        where: { productId: image.productId },
        data: { isCover: false },
      });
    }

    return this.prisma.productImage.update({
      where: { id },
      data: dto,
    });
  }

  // =========================================================
  // DELETE IMAGE (WITH CLOUDINARY)
  // =========================================================
  async deleteImage(id: string) {
    const image = await this.ensureImageExists(id);

    // delete from cloudinary if exists
    if ((image as any).publicId) {
      try {
        await this.cloudinary.deleteImage((image as any).publicId);
      } catch {
        throw new BaseException(
          ErrorCodes.CLOUDINARY_DELETE_FAILED,
          500,
        );
      }
    }

    await this.prisma.productImage.delete({
      where: { id },
    });

    // fix cover
    if (image.isCover) {
      const next = await this.prisma.productImage.findFirst({
        where: { productId: image.productId },
        orderBy: { position: 'asc' },
      });

      if (next) {
        await this.prisma.productImage.update({
          where: { id: next.id },
          data: { isCover: true },
        });
      }
    }

    return { success: true };
  }

  // =========================================================
  // REORDER (SAFE)
  // =========================================================
  async reorderImages(productId: string, dto: ReorderProductImagesDto) {
    await this.ensureProductExists(productId);

    const images = await this.prisma.productImage.findMany({
      where: { productId },
      select: { id: true },
    });

    const validIds = new Set(images.map((i) => i.id));

    // prevent hacking images of other products
    dto.items.forEach((item) => {
      if (!validIds.has(item.id)) {
        throw new BaseException(
          ErrorCodes.INVALID_DATA,
          400,
        );
      }
    });

    const ops = dto.items.map((item) =>
      this.prisma.productImage.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    );

    await this.prisma.$transaction(ops);

    return this.findByProduct(productId);
  }

  // =========================================================
  // SET COVER
  // =========================================================
  async setCoverImage(id: string) {
    const image = await this.ensureImageExists(id);

    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isCover: false },
    });

    return this.prisma.productImage.update({
      where: { id },
      data: { isCover: true },
    });
  }

  // =========================================================
  // ADD SINGLE IMAGE
  // =========================================================
  async addSingleImage(
    productId: string,
    file: Express.Multer.File,
    isCover?: boolean,
    position?: number,
  ) {
    await this.ensureProductExists(productId);

    if (!file) {
      throw new BaseException(ErrorCodes.FILE_REQUIRED, 400);
    }

    const uploaded = await this.cloudinary.uploadImage(file, 'products');

    if (isCover) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isCover: false },
      });
    }

    return this.prisma.productImage.create({
      data: {
        url: uploaded.url,
        publicId: uploaded.publicId,
        isCover: isCover ?? false,
        position: position ?? 0,
        productId,
      },
    });
  }

  // =========================================================
  // HELPERS
  // =========================================================
  private async ensureProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BaseException(
        ErrorCodes.PRODUCT_NOT_FOUND,
        404,
      );
    }
  }

  private async ensureImageExists(id: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new BaseException(
        ErrorCodes.INVALID_DATA,
        404,
      );
    }

    return image;
  }
}