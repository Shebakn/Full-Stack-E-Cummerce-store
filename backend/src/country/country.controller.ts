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

import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { CountryResponseDto } from './dto/country-response.dto';

import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Country')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  // =========================
  // CREATE (ADMIN)
  // =========================
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create country (Admin)' })
  @ApiBody({ type: CreateCountryDto })
  async create(@Body() dto: CreateCountryDto) {
    const result = await this.countryService.create(dto);

    return {
      data: plainToInstance(CountryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Country created successfully' },
      error: null,
    };
  }

  // =========================
  // GET ALL
  // =========================
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all countries (with filters & pagination)' })
  async findAll(@Query() query: QueryCountryDto) {
    const result = await this.countryService.findAll(query);

    return {
      data: plainToInstance(CountryResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
      error: null,
    };
  }

  // =========================
  // GET ACTIVE ONLY
  // =========================
  @Public()
  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get active countries only' })
  async findActive() {
    const result = await this.countryService.findActive();

    return {
      data: plainToInstance(CountryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Active countries fetched successfully' },
      error: null,
    };
  }

  // =========================
  // GET ONE
  // =========================
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get country by id' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const result = await this.countryService.findOne(id);

    return {
      data: plainToInstance(CountryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Country fetched successfully' },
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
  @ApiOperation({ summary: 'Update country (Admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCountryDto })
  async update(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    const result = await this.countryService.update(id, dto);

    return {
      data: plainToInstance(CountryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Country updated successfully' },
      error: null,
    };
  }

  // =========================
  // TOGGLE STATUS (ADMIN)
  // =========================
  @Patch(':id/toggle')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle country active status' })
  @ApiParam({ name: 'id', type: String })
  async toggleStatus(@Param('id') id: string) {
    const result = await this.countryService.toggleStatus(id);

    return {
      data: plainToInstance(CountryResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Country status toggled' },
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
  @ApiOperation({ summary: 'Delete country (Admin)' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string) {
    await this.countryService.remove(id);

    return {
      data: null,
      meta: { message: 'Country deleted successfully' },
      error: null,
    };
  }
}