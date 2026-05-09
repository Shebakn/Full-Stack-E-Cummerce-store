import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes';
import { ErrorMessages } from './error-messages';

export function throwError(
  code: ErrorCodes,
  status: HttpStatus,
  details?: any,
): never {
  throw new HttpException(
    {
      message: ErrorMessages[code],
      code,
      details: details ?? null,
    },
    status,
  );
}