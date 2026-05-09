import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { plainToInstance } from 'class-transformer';
import { QueryCouponDto } from './dto/query-coupon.dto';
import { CouponResponseDto } from './dto/coupon-response.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // @Docs Admin can create coupon
  // @Route Post api/v1/coupon
  // @Access Private [ADMIN]
  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  // @Docs Admin can get all coupons
  // @Route Get api/v1/coupon
  // @Access Private [ADMIN]
  // @Query for pagination and filtering
  @Get()
async findAll(@Query() query: QueryCouponDto) {
  const result = await this.couponService.findAll(query);

  const transformedData = plainToInstance(CouponResponseDto, result.data, {
    excludeExtraneousValues: true,
  });

  return {
    data: transformedData,
    meta: result.meta,
  };
}
  // @Docs Admin can get single coupon
  // @Route Get api/v1/coupon/:id
  // @Access Private [ADMIN]
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.couponService.findOne(id);
  }

  // @Docs Admin can update coupon
  // @Route Patch api/v1/coupon/:id
  // @Access Private [ADMIN]
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  // @Docs Admin can delete coupon
  // @Route Delete api/v1/coupon/:id
  // @Access Private [ADMIN]
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
