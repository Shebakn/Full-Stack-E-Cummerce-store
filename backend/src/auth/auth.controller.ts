import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  LoginAuthDto,
} from './dto/create-auth.dto';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from './dto/reset-password.dto';

import { plainToInstance } from 'class-transformer';
import { AuthResponseDto } from './dto/auth-response.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';

import { ResponseFactory } from '@/common/responses/response.factory';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================
  // REGISTER
  // =========================
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateAuthDto })
  @ApiWrappedResponse(AuthResponseDto, {
    statusCode: 201,
  })


  async register(@Body() dto: CreateAuthDto) {
    const result = await this.authService.register(dto);

    const data = plainToInstance(AuthResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return ResponseFactory.successWithMessage(
      data,
      'User registered successfully',
    );
  }

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginAuthDto })
  @ApiWrappedResponse(AuthResponseDto, {
    statusCode: 200,
  })

  async login(@Body() dto: LoginAuthDto) {
    const result = await this.authService.login(dto);

    console.log(result)
    const data = plainToInstance(AuthResponseDto, result, {
      excludeExtraneousValues: true,
    });

    console.log(data)
    return ResponseFactory.successWithMessage(
      data,
      'Login successful',
    );
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send reset password code' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiWrappedResponse(undefined, {
    statusCode: 200,
  })

  async forgotPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email);

    return ResponseFactory.onlyMessage(
      'Reset code sent successfully',
    );
  }

  // =========================
  // VERIFY CODE
  // =========================
  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify reset code' })
  @ApiBody({ type: VerifyResetCodeDto })
  @ApiWrappedResponse(
    class {
      isVerified!: boolean;
    },
    {
      statusCode: 200,
    }
  )
  
  async verifyCode(@Body() dto: VerifyResetCodeDto) {
    const isVerified = await this.authService.verifyResetCode(
      dto.email,
      dto.verificationCode,
    );

    return ResponseFactory.success({ isVerified });
  }

  // =========================
  // RESET PASSWORD
  // =========================
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiWrappedResponse(undefined, {
    statusCode: 200,
  })
  async resetPassword(@Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(
      dto.email,
      dto.newPassword,
    );

    return ResponseFactory.onlyMessage(
      'Password reset successfully',
    );
  }
}