import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { DeliveryCenterService } from './delivery-center.service';
import { CreateDeliveryCenterDto } from './dto/create-delivery-center.dto';
import { UpdateDeliveryCenterDto } from './dto/update-delivery-center.dto';
import { QueryDeliveryCenterDto } from './dto/query-delivery-center.dto';
import { DeliveryCenterResponseDto } from './dto/delivery-center-response.dto';

import { RolesGuard } from '@/common/guards/roles.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Delivery Center')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('delivery-center')
export class DeliveryCenterController {
  constructor(private readonly service: DeliveryCenterService) {}

  // =========================
  // CREATE (ADMIN)
  // =========================
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create delivery center (Admin)' })
  @ApiBody({ type: CreateDeliveryCenterDto })
  async create(@Body() dto: CreateDeliveryCenterDto) {
    const result = await this.service.create(dto);

    return {
      data: plainToInstance(DeliveryCenterResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Center created successfully' },
      error: null,
    };
  }

  // =========================
  // GET ALL
  // =========================
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get delivery centers' })
  async findAll(@Query() query: QueryDeliveryCenterDto) {
    const result = await this.service.findAll(query);

    return {
      data: plainToInstance(DeliveryCenterResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
      error: null,
    };
  }

  // =========================
  // NEAREST
  // =========================
  @Public()
  @Get('nearest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get nearest delivery centers' })
  async nearest(@Query() query: QueryDeliveryCenterDto) {
    const result = await this.service.findNearest(query);

    return {
      data: plainToInstance(DeliveryCenterResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Nearest centers fetched' },
      error: null,
    };
  }

  // =========================
  // GET ONE
  // =========================
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get center by id' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);

    return {
      data: plainToInstance(DeliveryCenterResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Center fetched successfully' },
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
  @ApiOperation({ summary: 'Update center (Admin)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateDeliveryCenterDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryCenterDto,
  ) {
    const result = await this.service.update(id, dto);

    return {
      data: plainToInstance(DeliveryCenterResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: 'Center updated successfully' },
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
  @ApiOperation({ summary: 'Delete center (Admin)' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);

    return {
      data: null,
      meta: { message: 'Center deleted successfully' },
      error: null,
    };
  }
}