import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =========================
  // GLOBAL PREFIX
  // =========================
  app.setGlobalPrefix('api/v1');

  // =========================
  // VALIDATION PIPE
  // =========================
  app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true, // 🔥 هذا هو المفتاح
  }),
);

  // =========================
  // INTERCEPTORS
  // =========================
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // =========================
  // GLOBAL FILTERS
  // =========================
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );

  // =========================
  // 🔥 SWAGGER SETUP
  // =========================
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for your backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken', // اسم المفتاح
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

   document.tags = [
  { name: 'Auth', description: 'Authentication endpoints (login, register, JWT)' },

  { name: 'User', description: 'Manage users (Admin only)' },

  { name: 'Category', description: 'Category management (tree + hierarchy)' },

  { name: 'Brand', description: 'Brand management' },

  { name: 'Product', description: 'Product CRUD + queries + details' },

  { name: 'Product Images', description: 'Manage product images (upload, reorder, cover)' },

  { name: 'Product Variants', description: 'Product variants (price, stock, attributes)' },

  { name: 'Reviews', description: 'Product reviews system (rating + comments)' },

  { name: 'Upload', description: 'Cloudinary file upload (Admin only)' },
];
   
  SwaggerModule.setup('docs', app, document);

  // =========================
  // START SERVER
  // =========================
  app.enableCors({
  origin: [
    "http://localhost:5173",
    "https://full-stack-e-cummerce-store.vercel.app",
    "https://full-stack-e-cummerce-store.vercel.app/login",
    "https://full-stack-e-cummerce-store.vercel.app/register",
  ],
  credentials: true,
});

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
}

bootstrap();