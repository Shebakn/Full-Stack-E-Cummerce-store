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
} from "@nestjs/common";

import { plainToInstance } from "class-transformer";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

import { RegionService } from "./region.service";

import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { QueryRegionDto } from "./dto/query-region.dto";
import { RegionResponseDto } from "./dto/region-response.dto";

import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("Region")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("region")
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  // =========================
  // CREATE (ADMIN)
  // =========================
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create region (Admin)" })
  @ApiBody({ type: CreateRegionDto })
  async create(@Body() dto: CreateRegionDto) {
    const result = await this.regionService.create(dto);

    return {
      data: plainToInstance(RegionResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: "Region created successfully" },
      error: null,
    };
  }

  // =========================
  // GET ALL
  // =========================
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all regions (pagination + filter)" })
  async findAll(@Query() query: QueryRegionDto) {
    const result = await this.regionService.findAll(query);

    return {
      data: plainToInstance(RegionResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
      error: null,
    };
  }

  // =========================
  // GET BY COUNTRY
  // =========================
  @Public()
  @Get("country/:countryId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get regions by country" })
  @ApiParam({ name: "countryId", type: String })
  async getByCountry(@Param("countryId") countryId: string) {
    const result = await this.regionService.getByCountry(countryId);

    return {
      data: plainToInstance(RegionResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: "Regions fetched successfully" },
      error: null,
    };
  }

  // =========================
  // GET ONE
  // =========================
  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get region by id" })
  @ApiParam({ name: "id", type: String })
  async findOne(@Param("id") id: string) {
    const result = await this.regionService.findOne(id);

    return {
      data: plainToInstance(RegionResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: "Region fetched successfully" },
      error: null,
    };
  }

  // =========================
  // UPDATE (ADMIN)
  // =========================
  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update region (Admin)" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateRegionDto })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateRegionDto,
  ) {
    const result = await this.regionService.update(id, dto);

    return {
      data: plainToInstance(RegionResponseDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: { message: "Region updated successfully" },
      error: null,
    };
  }

  // =========================
  // DELETE (ADMIN)
  // =========================
  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete region (Admin)" })
  @ApiParam({ name: "id", type: String })
  async remove(@Param("id") id: string) {
    await this.regionService.remove(id);

    return {
      data: null,
      meta: { message: "Region deleted successfully" },
      error: null,
    };
  }
}