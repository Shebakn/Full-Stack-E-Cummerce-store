import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { CartService } from './cart.service';

import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/upate-cart-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

import { CartResponseDto } from './dto/cart-response.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // =========================================================
  // GET CART
  // =========================================================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Req() req: any) {
    const result = await this.cartService.getCart(req.user.id);

    return this.response(result, 'Cart fetched successfully');
  }

  // =========================================================
  // ADD ITEM
  // =========================================================
  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart (no duplicates allowed)' })
  @ApiBody({ type: CreateCartItemDto })
  async addItem(@Req() req: any, @Body() dto: CreateCartItemDto) {
    const result = await this.cartService.addItem(
      req.user.id,
      dto,
    );

    return this.response(result, 'Item added to cart');
  }

  // =========================================================
  // UPDATE ITEM
  // =========================================================
  @Patch('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCartItemDto })
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const result = await this.cartService.updateItem(id, dto);

    return this.response(result, 'Cart item updated');
  }

  // =========================================================
  // REMOVE ITEM
  // =========================================================
  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', type: String })
  async removeItem(@Param('id') id: string) {
    const result = await this.cartService.removeItem(id);

    return this.response(result, 'Item removed from cart');
  }

  // =========================================================
  // CLEAR CART
  // =========================================================
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Req() req: any) {
    const result = await this.cartService.clearCart(req.user.id);

    return this.response(result, 'Cart cleared');
  }

  // =========================================================
  // APPLY COUPON
  // =========================================================
  @Post('coupon')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply coupon to cart' })
  @ApiBody({ type: ApplyCouponDto })
  async applyCoupon(
    @Req() req: any,
    @Body() dto: ApplyCouponDto,
  ) {
    const result = await this.cartService.applyCoupon(
      req.user.id,
      dto.couponId,
    );

    return this.response(result, 'Coupon applied successfully');
  }

  // =========================================================
  // REMOVE COUPON
  // =========================================================
  @Delete('coupon')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove coupon from cart' })
  async removeCoupon(@Req() req: any) {
    const result = await this.cartService.removeCoupon(req.user.id);

    return this.response(result, 'Coupon removed');
  }

  // =========================================================
  // 🔥 RESPONSE HELPER
  // =========================================================
  private response(data: any, message: string) {
    return {
      data: plainToInstance(CartResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta: { message },
      error: null,
    };
  }
}