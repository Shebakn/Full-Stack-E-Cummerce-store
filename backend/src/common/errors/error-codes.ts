export enum ErrorCodes {
  // =========================
  // AUTH
  // =========================
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_USER_EXISTS = 'AUTH_USER_EXISTS',
  AUTH_INVALID_CODE = 'AUTH_INVALID_CODE',


  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  // =========================
  // USER
  // =========================
  USER_NOT_FOUND = 'USER_NOT_FOUND',


  // =========================
  // CAEGOTY
  // =========================
  CATEGORY_NOT_FOUND = 'CAEGOTY_NOT_FOUND',

  BRAND_NOT_FOUND = 'BRAND_NOT_FOUND',

  // =========================
  // DATABASE
  // =========================
  DB_DUPLICATE = 'DB_DUPLICATE',

  // =========================
  // MAIL
  // =========================
  MAIL_SEND_FAILED = 'MAIL_SEND_FAILED',

  // =========================
  // GENERAL
  // =========================
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  FILE_REQUIRED = 'FILE_REQUIRED',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',

  CLOUDINARY_UPLOAD_FAILED = 'CLOUDINARY_UPLOAD_FAILED',
  CLOUDINARY_DELETE_FAILED = 'CLOUDINARY_DELETE_FAILED',

  INVALID_DATA = 'INVALID_DATA',
  NOT_FOUND = "NOT_FOUND",
  INVALID_COUPON = "INVALID_COUPON",
  
  // =========================
  // COUNTRY
  // =========================
  COUNTRY_NOT_FOUND="Country not found",

  REGION_NOT_FOUND="Region not found",
}