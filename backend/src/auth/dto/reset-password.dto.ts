import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;
}

export class VerifyResetCodeDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({
    example: '123456',
    minLength: 4,
    maxLength: 10,
  })
  @IsString({ message: 'Verification code must be a string' })
  @Length(4, 10, {
    message: 'Verification code must be between 4 and 10 characters',
  })
  verificationCode!: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({
    example: 'NewStrongPassword123',
    minLength: 6,
    maxLength: 30,
  })
  @IsString({ message: 'New password must be a string' })
  @Length(6, 30, {
    message: 'Password must be between 6 and 30 characters',
  })
  newPassword!: string;
}