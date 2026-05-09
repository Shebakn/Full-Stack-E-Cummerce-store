import { Module } from "@nestjs/common";
import { ProductImageService } from "./product-image.service";
import { ProductImageController } from "./product-image.controller";
import { PrismaService } from "@/prisma/prisma.service";
import { CloudinaryService } from "@/cloudinary/cloudinary.service";

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService, PrismaService, CloudinaryService],
  exports: [ProductImageService],
})
export class ProductImageModule {}