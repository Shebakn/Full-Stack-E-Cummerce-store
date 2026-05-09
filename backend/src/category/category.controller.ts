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
  ApiBody,
} from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Category')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // =========================
  // CREATE (ADMIN)
  // =========================
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category (Admin)' })
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.categoryService.create(dto);

    return {
      data: plainToInstance(CategoryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Category created successfully' },
      error: null,
    };
  }

  // =========================
  // GET ALL
  // =========================
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Get categories (default: roots only, includeChildren=true for tree)',
  })
  async findAll(@Query() query: QueryCategoryDto) {
    const result = await this.categoryService.findAll(query);

    return {
      data: plainToInstance(CategoryResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
      error: null,
    };
  }

  // =========================
  // GET ONE
  // =========================
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category by id' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const result = await this.categoryService.findOne(id);

    return {
      data: plainToInstance(CategoryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Category fetched successfully' },
      error: null,
    };
  }

  // =========================
  // UPDATE (ADMIN)
  // =========================
  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category (Admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCategoryDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const result = await this.categoryService.update(id, dto);

    return {
      data: plainToInstance(CategoryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Category updated successfully' },
      error: null,
    };
  }

  // =========================
  // DELETE (ADMIN)
  // =========================
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category (Admin)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);

    return {
      data: null,
      meta: { message: 'Category deleted successfully' },
      error: null,
    };
  }
}