import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CloudinaryService } from './cloudinary.service';
import { ResponseFactory } from '@/common/responses/response.factory';
import { plainToInstance } from 'class-transformer';
import { UploadResponseDto } from './dto/upload-response.dto';
import { ApiWrappedResponse } from '@/common/decorators/api-wrapped-response.decorator';

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(
    private readonly cloudinary: CloudinaryService) {}


  // =========================
  // UPLOAD IMAGE
  // =========================
  @Post()
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: 'Upload single image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiWrappedResponse(UploadResponseDto, {
      statusCode: 201,
    })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result =  this.cloudinary.uploadImage(file, 'products');

    return ResponseFactory.successWithMessage( plainToInstance(UploadResponseDto, result, {
    excludeExtraneousValues: true,
  }),
    "Image uploaded successfully")
  }
}