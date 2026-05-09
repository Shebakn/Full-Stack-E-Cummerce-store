import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // =========================================================
  // CREATE REVIEW
  // =========================================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create review for a product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: CreateReviewDto })
  async create(
    @Param('productId') productId: string,
    @Req() req: any,
    @Body() dto: CreateReviewDto,
  ) {
    const userId = req.user.id;

    return this.reviewService.create(userId, productId, dto);
  }

  // =========================================================
  // GET REVIEWS BY PRODUCT (WITH PAGINATION)
  // =========================================================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reviews by product (pagination + filters)' })
  @ApiParam({ name: 'productId', type: String })
  @ApiQuery({ type: QueryReviewDto })
  async findByProduct(
    @Param('productId') productId: string,
    @Query() query: QueryReviewDto,
  ) {
    return this.reviewService.findByProduct(productId, query);
  }

  // =========================================================
  // UPDATE REVIEW
  // =========================================================
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update review (owner only)' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'id', type: String, description: 'Review ID' })
  @ApiBody({ type: UpdateReviewDto })
  async update(
    @Param('id') reviewId: string,
    @Req() req: any,
    @Body() dto: UpdateReviewDto,
  ) {
    const userId = req.user.id;

    return this.reviewService.update(reviewId, userId, dto);
  }

  // =========================================================
  // DELETE REVIEW
  // =========================================================
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete review (owner only)' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'id', type: String, description: 'Review ID' })
  async remove(@Param('id') reviewId: string, @Req() req: any) {
    const userId = req.user.id;

    return this.reviewService.remove(reviewId, userId);
  }
}