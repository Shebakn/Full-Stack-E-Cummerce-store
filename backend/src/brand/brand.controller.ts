import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { QueryBrandDto } from './dto/query-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';

import { RolesGuard } from '@/common/guards/roles.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { Public } from '@/common/decorators/public.decorator';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator'; 

@ApiTags('Brand')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('accessToken')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // =========================
  // CREATE BRAND (ADMIN)
  // =========================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create brand (Admin only)' })
  @ApiBody({ type: CreateBrandDto })
  @ApiWrappedResponse(BrandResponseDto, {
    statusCode: 201,
    message: 'Brand created successfully',
  })
  async create(@Body() dto: CreateBrandDto) {
    const brand = await this.brandService.create(dto);

    return {
      data: plainToInstance(BrandResponseDto, brand, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Brand created successfully' },
    };
  }

  // =========================
  // GET ALL BRANDS (PUBLIC)
  // =========================
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all brands' })
  @ApiQuery({ type: QueryBrandDto })
  @ApiWrappedResponse(BrandResponseDto, {
    statusCode: 200,
    message: 'Brands fetched successfully',
    pagination: true,
  })
  async findAll(@Query() query: QueryBrandDto) {
    const result = await this.brandService.findAll(query);

    return {
      data: plainToInstance(BrandResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
    };
  }

  // =========================
  // GET ONE BRAND (PUBLIC)
  // =========================
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get brand by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiWrappedResponse(BrandResponseDto, {
    statusCode: 200,
    message: 'Brand fetched successfully',
  })
  async findOne(@Param('id') id: string) {
    const brand = await this.brandService.findOne(id);

    return {
      data: plainToInstance(BrandResponseDto, brand, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Brand fetched successfully' },
    };
  }

  // =========================
  // UPDATE BRAND (ADMIN)
  // =========================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update brand (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateBrandDto })
  @ApiWrappedResponse(BrandResponseDto, {
    statusCode: 200,
    message: 'Brand updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    const brand = await this.brandService.update(id, dto);

    return {
      data: plainToInstance(BrandResponseDto, brand, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Brand updated successfully' },
    };
  }

  // =========================
  // DELETE BRAND (ADMIN)
  // =========================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete brand (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiWrappedResponse(undefined, {
    statusCode: 204,
    message: 'Brand deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.brandService.remove(id);

    return {
      data: null,
      meta: { message: 'Brand deleted successfully' },
    };
  }
}