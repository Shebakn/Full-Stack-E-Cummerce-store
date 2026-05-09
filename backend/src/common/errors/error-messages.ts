import { ErrorCodes } from './error-codes';

export const ErrorMessages: Record<ErrorCodes, string> = {
  // AUTH
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCodes.AUTH_USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.AUTH_USER_EXISTS]: 'User already exists',
  [ErrorCodes.AUTH_INVALID_CODE]: 'Invalid or expired code',

  // USER
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',

  // DB
  [ErrorCodes.DB_DUPLICATE]: 'Duplicate value',

  // MAIL
  [ErrorCodes.MAIL_SEND_FAILED]: 'Failed to send email',

  // GENERAL
  [ErrorCodes.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error',
  [ErrorCodes.CATEGORY_NOT_FOUND]: 'Category not found',
  [ErrorCodes.PRODUCT_NOT_FOUND]: 'Product not found',
  [ErrorCodes.BRAND_NOT_FOUND]: 'Brand not found',
  
  // FILE / UPLOAD
[ErrorCodes.FILE_REQUIRED]: 'File is required',
[ErrorCodes.INVALID_FILE_TYPE]: 'Invalid file type, only images are allowed',

// CLOUDINARY
[ErrorCodes.CLOUDINARY_UPLOAD_FAILED]: 'Failed to upload image',
[ErrorCodes.CLOUDINARY_DELETE_FAILED]: 'Failed to delete image',

// DATA
[ErrorCodes.INVALID_DATA]: 'Invalid data provided',
};