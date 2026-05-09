import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantsDto } from './dto/create-product-varients.dto';
import { UpdateProductVariantDto } from './dto/update-varient.dto';

@ApiTags('Product Variants')
@Controller('products/:productId/variants')
export class ProductVariantController {
  constructor(
    private readonly productVariantService: ProductVariantService,
  ) {}

  // =========================================================
  // CREATE VARIANTS
  // POST /products/:productId/variants
  // =========================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product variants' })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: CreateProductVariantsDto })
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateProductVariantsDto,
  ) {
    return this.productVariantService.create(productId, dto);
  }

  // =========================================================
  // GET ALL VARIANTS BY PRODUCT
  // GET /products/:productId/variants
  // =========================================================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all variants for a product' })
  @ApiParam({ name: 'productId', type: String })
  async findByProduct(@Param('productId') productId: string) {
    return this.productVariantService.findByProduct(productId);
  }

  // =========================================================
  // SINGLE VARIANT
  // GET /products/:productId/variants/:id
  // =========================================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single variant' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  // =========================================================
  // UPDATE VARIANT
  // PATCH /products/:productId/variants/:id
  // =========================================================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update variant' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProductVariantDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(id, dto);
  }

  // =========================================================
  // DELETE VARIANT
  // DELETE /products/:productId/variants/:id
  // =========================================================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete variant' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string) {
    return this.productVariantService.remove(id);
  }

  // =========================================================
  // UPDATE STOCK ONLY
  // PATCH /products/:productId/variants/:id/stock
  // =========================================================
  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update variant stock only' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'id', type: String })
  async updateStock(
    @Param('id') id: string,
    @Body('stock') stock: number,
  ) {
    return this.productVariantService.updateStock(id, stock);
  }
}