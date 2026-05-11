import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Product')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('accessToken')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // =========================================================
  // CREATE PRODUCT
  // =========================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imageCover'))
  @ApiOperation({ summary: 'Create product (file or URL image) (Admin only)' })
  @ApiBody({ type: CreateProductDto })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    const result = await this.productService.create(dto, file);

    return {
      data: plainToInstance(ProductResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        message: 'Product created successfully',
      },
      error: null,
    };
  }

  // =========================================================
  // GET ALL PRODUCTS (SINGLE ENTRY POINT)
  // =========================================================
  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products (filters + pagination)' })
  @ApiQuery({ type: QueryProductDto })
  async findAll(@Query() query: QueryProductDto) {
    console.log(query)
    const result = await this.productService.findAll(query);

    return {
      data: plainToInstance(ProductResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
      error: null,
    };
  }

  // =========================================================
  // GET SINGLE PRODUCT
  // =========================================================
  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    console.log(id)
    const result = await this.productService.findOne(id);

    return {
      data: plainToInstance(ProductResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        message: 'Product fetched successfully',
      },
      error: null,
    };
  }

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('imageCover'))
  @ApiOperation({ summary: 'Update product (supports file) (Admin only)' })
  @ApiBody({type: UpdateProductDto})
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.productService.update(id, dto, file);

    return {
      data: plainToInstance(ProductResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        message: 'Product updated successfully',
      },
      error: null,
    };
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);

    return {
      data: null,
      meta: {
        message: 'Product deleted successfully',
      },
      error: null,
    };
  }
}