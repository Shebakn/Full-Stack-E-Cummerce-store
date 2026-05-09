import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { ErrorCodes } from '@/common/errors/error-codes';
import { BaseException } from '@/common/exceptions/base.exception';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

  // =========================
  // VALIDATION
  // =========================
  private validateFile(file?: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BaseException(ErrorCodes.FILE_REQUIRED, 400);
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BaseException(ErrorCodes.INVALID_FILE_TYPE, 400);
    }
  }

  // =========================
  // UPLOAD SINGLE
  // =========================
  async uploadImage(
    file: Express.Multer.File,
    folder = 'products',
  ): Promise<{ url: string; publicId: string }> {
    this.validateFile(file);

    try {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error || !result) {
              return reject(error);
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          },
        );

        stream.end(file.buffer);
      });
    } catch (err) {
      throw new BaseException(ErrorCodes.CLOUDINARY_UPLOAD_FAILED, 500);
    }
  }

  // =========================
  // UPLOAD MULTIPLE
  // =========================
  async uploadImages(
    files: Express.Multer.File[],
    folder = 'products',
  ) {
    if (!files?.length) {
      throw new BaseException(ErrorCodes.FILE_REQUIRED, 400);
    }

    return Promise.all(
      files.map((file) => this.uploadImage(file, folder)),
    );
  }

  // =========================
  // DELETE IMAGE
  // =========================
  async deleteImage(publicId: string) {
    if (!publicId) {
      throw new BaseException(ErrorCodes.INVALID_DATA, 400);
    }

    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (err) {
      throw new BaseException(ErrorCodes.CLOUDINARY_DELETE_FAILED, 500);
    }
  }
}