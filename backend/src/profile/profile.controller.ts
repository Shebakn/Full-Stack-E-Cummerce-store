/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/profile/profile.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';
import { MyProfileResponseDto } from './dto/profile-response.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  // @Docs User can get their own profile
  // @Route Get api/v1/profile/me
  // @Access Private ['user', 'admin']
  @Get('me')
  async getMe(@Request() req) {
    console.log('Authenticated user info from JWT:', req.user.id); // Debug log to check the authenticated user info
    const user = await this.userService.getMe(req.user.id);
    return plainToInstance(MyProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // @Docs User can update their own profile
  // @Route Patch api/v1/profile/me
  // @Access Private ['user', 'admin']
  @Patch('me')
  async updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(req.user.id, updateUserDto);
    return plainToInstance(MyProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // @Docs User can delete their own accounts
  // @Route Delete api/v1/profile/me
  // @Access Private ['user', 'admin']
  @Delete('me')
  async deleteMe(@Request() req) {
    const user = await this.userService.remove(req.user.id);
    return plainToInstance(MyProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
