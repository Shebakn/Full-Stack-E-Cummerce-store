/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/profile/profile.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request, // هذا الـ Decorator الخاص بـ NestJS
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';
import { MyProfileResponseDto } from './dto/profile-response.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto'; // تأكد من مسار الـ DTO الصحيح عندك

// استيراد الـ Type الخاص بالريكوست من إكسبريس وتسميته باسم مختلف منعا للتعارض
import { Request as ExpressRequest } from 'express'; 

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  // @Docs User can get their own profile
  // @Route Get api/v1/profile/me
  // @Access Private ['user', 'admin']
  @Get('me')
  async getMe(@Request() req: ExpressRequest) {
    // التايب سكريبت قد يشتكي من req.user لو مش معرّف في إكسبريس، كحل سريع وآمن:
    const userId = (req as any).user?.id;
    
    console.log('Authenticated user info from JWT:', userId); 
    const user = await this.userService.getMe(userId);
    return plainToInstance(MyProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // @Docs User can update their own profile
  // @Route Patch api/v1/profile/me
  // @Access Private ['user', 'admin']
  @Patch('me')
  async updateMe(@Request() req: ExpressRequest, @Body() updateUserDto: UpdateUserDto) {
    const userId = (req as any).user?.id;
    const user = await this.userService.update(userId, updateUserDto);
    return plainToInstance(MyProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // @Docs User can delete their own profile
  // @Route Delete api/v1/profile/me
  // @Access Private ['user', 'admin']
  @Delete('me')
  async deleteMe(@Request() req: ExpressRequest) {
    const userId = (req as any).user?.id;
    await this.userService.remove(userId); // أو الدالة المسؤولية عن الحذف عندك
    return { success: true, message: 'Profile deleted successfully' };
  }
}