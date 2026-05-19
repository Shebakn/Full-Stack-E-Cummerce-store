import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '@/common/interfaces/payload.interface';
import { MailerService } from '@nestjs-modules/mailer';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCodes } from '@/common/errors/error-codes';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // =========================
  // REGISTER
  // =========================
  async register(dto: CreateAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BaseException(
        ErrorCodes.AUTH_USER_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return this.buildAuthResponse(user);
  }

  // =========================
  // LOGIN
  // =========================
  async login(dto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BaseException(
        ErrorCodes.AUTH_INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new BaseException(
        ErrorCodes.AUTH_INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.buildAuthResponse(user);
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  async resetPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BaseException(
        ErrorCodes.AUTH_USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const code = this.generateCode();

    await this.prisma.user.update({
      where: { email },
      data: {
        verificationCode: code,
        verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    try {
      await this.mailerService.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: 'Reset Password',
        html: this.buildResetEmail(code),
      });

      return { message: 'Verification code sent successfully' };
    } catch (err) {
      throw new BaseException(
        ErrorCodes.MAIL_SEND_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err instanceof Error ? err.message : 'Unknown error',
      );
    }
  }

  // =========================
  // VERIFY CODE
  // =========================
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BaseException(
        ErrorCodes.AUTH_USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const isExpired =
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date();

    const isInvalid = user.verificationCode !== code;

    if (isExpired || isInvalid) {
      throw new BaseException(
        ErrorCodes.AUTH_INVALID_CODE,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    return true;
  }

  // =========================
  // CHANGE PASSWORD
  // =========================
  async changePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BaseException(
        ErrorCodes.AUTH_USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  // =========================
  // AUTH RESPONSE
  // =========================
  private buildAuthResponse(user: any) {
    const { password, ...safeUser } = user;

    const payload: Payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      user: safeUser,
      accessToken,
    };
  }

  // =========================
  // HELPERS
  // =========================
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private buildResetEmail(code: string): string {
    return `
      <div>
        <h3>Password Reset Code</h3>
        <p><b>${code}</b></p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `;
  }
}