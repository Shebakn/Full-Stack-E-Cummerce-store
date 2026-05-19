import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProductImageModule } from './productImage/product-image.module';
import { ReviewModule } from './reviews/review.module';
import { ProductVariantModule } from './productVarient/product-variant.module';
import { CartModule } from './cart/cart.module';
import { CountryModule } from './country/country.module';
import { RegionModule } from './region/region.module';
import { DeliveryCenterModule } from './delivery-center/delivery-center.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 هذا السطر سيجعل ConfigService متاحاً في كل مكان دون استيراد يدوي
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProfileModule,
    CloudinaryModule,
    MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
}),

    CategoryModule,

    BrandModule,

    CouponModule,

    ProductModule,

    ReviewModule,

    ProductVariantModule,

    ProductImageModule,

    CartModule,

    CountryModule,

    RegionModule,

    DeliveryCenterModule,
  ],
})
export class AppModule {}
