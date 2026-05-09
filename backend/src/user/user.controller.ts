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
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';

import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

import { ResponseFactory } from '@/common/responses/response.factory';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('accessToken')
@Roles(Role.ADMIN)
@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // =========================
  // CREATE USER
  // =========================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiWrappedResponse(UserResponseDto, {
    statusCode: 201,
    message: 'User created successfully',
  })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return ResponseFactory.successWithMessage(
      plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
      'User created successfully',
    );
  }

  // =========================
  // GET ALL USERS (PAGINATION)
  // =========================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiWrappedResponse(UserResponseDto, {
    statusCode: 200,
    message: 'Users fetched successfully',
    pagination: true,
  })
  async findAll(@Query() query: QueryUserDto) {
    const result = await this.userService.findAll(query);

    return ResponseFactory.pagination(
      plainToInstance(UserResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
      },
      'Users fetched successfully',
    );
  }

  // =========================
  // GET USER BY ID
  // =========================
  @ApiOperation({ summary: 'Get single user (Admin only)' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiWrappedResponse(UserResponseDto, {
    statusCode: 200,
    message: 'User fetched successfully',
  })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    return ResponseFactory.success(
      plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  // =========================
  // UPDATE USER
  // =========================
  @Patch(':id')
  @ApiBody({ type: UpdateUserDto})
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiWrappedResponse(UserResponseDto, {
    statusCode: 200,
    message: 'User updated successfully',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);

    return ResponseFactory.successWithMessage(
      plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
      'User updated successfully',
    );
  }

  // =========================
  // TOGGLE ACTIVE (SOFT DELETE)
  // =========================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiWrappedResponse(UserResponseDto, {
    statusCode: 200,
    message: 'User status updated successfully',
  })
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);

    return ResponseFactory.successWithMessage(
      plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
      'User status updated successfully',
    );
  }
}