/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // نضع قيمة احتياطية 'topSecret' فقط لمنع الخطأ إذا تأخر تحميل الملف
      secretOrKey: jwtSecret || 'temporary_secret_key_to_prevent_crash',
    });

    if (!jwtSecret) {
      console.warn('⚠️ Warning: JWT_SECRET is not defined in .env file!');
    }
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      console.error('❌ Validation Failed: No "sub" found in JWT payload');
      throw new UnauthorizedException('Invalid token: missing subject');
    }

    try {
      // 2. الآن Prisma بأمان لأننا ضمنّا وجود قيمة للـ id
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      // 3. إذا كان الـ ID صالحاً ولكن المستخدم حُذف من القاعدة
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }

      // 4. إرجاع البيانات (سيتم وضعها في req.user)
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException(
        'Authentication failed due to server error',
      );
    }
  }
}
