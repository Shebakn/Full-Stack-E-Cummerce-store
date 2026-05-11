import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ProductImageService } from './product-image.service';

import { CreateProductImagesBulkDto } from './dto/create-product-images-bulk.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';

import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ReorderProductImagesDto } from './dto/reorder-image.dto';
import { UploadProductImageDto } from './dto/upload-image.dto';

@ApiTags('Product Images')
@ApiBearerAuth()
@Controller()
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
  ) {}

  // =========================================================
  // ADD MULTIPLE IMAGES
  // POST /products/:productId/images
  // =========================================================
  @Post('products/:productId/images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Upload multiple images for a product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductImagesBulkDto })
  async addImages(
    @Param('productId') productId: string,
    @Body() dto: CreateProductImagesBulkDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const result = await this.productImageService.addImages(
      productId,
      dto,
      files,
    );

    return {
      data: result,
      meta: { message: 'Images uploaded successfully' },
      error: null,
    };
  }

  // =========================================================
  // ADD SINGLE IMAGE
  // POST /products/:productId/images/single
  // =========================================================
  @Post('products/:productId/images/single')
@HttpCode(HttpStatus.CREATED)
@UseInterceptors(FileInterceptor('file'))
@ApiOperation({ summary: 'Upload single image' })
@ApiParam({ name: 'productId', type: String })
@ApiConsumes('multipart/form-data')
@ApiBody({ type: CreateProductImageDto })
async addSingleImage(
  @Param('productId') productId: string, // 🔥 FIX هنا
  @Body() dto: CreateProductImageDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  console.log(dto);
console.log(file);
  const result = await this.productImageService.addSingleImage(
    productId,
    file,
    dto.url,
    dto.isCover,
    dto.position,
  );

  return {
    data: result,
    meta: { message: 'Image uploaded successfully' },
    error: null,
  };
}
  // =========================================================
  // GET PRODUCT IMAGES
  // GET /products/:productId/images
  // =========================================================
  @Get('products/:productId/images')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all images of a product' })
  @ApiParam({ name: 'productId', type: String })
  async findByProduct(@Param('productId') productId: string) {
    const result =
      await this.productImageService.findByProduct(productId);

    return {
      data: result,
      meta: null,
      error: null,
    };
  }

  // =========================================================
  // UPDATE IMAGE
  // PATCH /product-images/:id
  // =========================================================
  @Patch('product-images/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product image' })
  @ApiParam({ name: 'id', type: String })
  async updateImage(
    @Param('id') id: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    const result =
      await this.productImageService.updateImage(id, dto);

    return {
      data: result,
      meta: { message: 'Image updated successfully' },
      error: null,
    };
  }

  // =========================================================
  // DELETE IMAGE
  // DELETE /product-images/:id
  // =========================================================
  @Delete('product-images/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product image' })
  @ApiParam({ name: 'id', type: String })
  async deleteImage(@Param('id') id: string) {
    await this.productImageService.deleteImage(id);

    return {
      data: null,
      meta: { message: 'Image deleted successfully' },
      error: null,
    };
  }

  // =========================================================
  // REORDER IMAGES
  // PATCH /products/:productId/images/reorder
  // =========================================================
  @Patch('products/:productId/images/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder product images' })
  @ApiParam({ name: 'productId', type: String })
  async reorderImages(
    @Param('productId') productId: string,
    @Body() dto: ReorderProductImagesDto,
  ) {
    const result =
      await this.productImageService.reorderImages(
        productId,
        dto,
      );

    return {
      data: result,
      meta: { message: 'Images reordered successfully' },
      error: null,
    };
  }

  // =========================================================
  // SET COVER IMAGE
  // PATCH /product-images/:id/cover
  // =========================================================
  @Patch('product-images/:id/cover')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set image as cover' })
  @ApiParam({ name: 'id', type: String })
  async setCoverImage(@Param('id') id: string) {
    const result =
      await this.productImageService.setCoverImage(id);

    return {
      data: result,
      meta: { message: 'Cover image updated successfully' },
      error: null,
    };
  }
}