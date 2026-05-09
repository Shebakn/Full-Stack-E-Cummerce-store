import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes';
import { ErrorMessages } from '../errors/error-messages';

export class BaseException extends HttpException {
  constructor(
    code: ErrorCodes,
    status: HttpStatus,
    details: any = null,
  ) {
    super(
      {
        message: ErrorMessages[code],
        code,
        details,
      },
      status,
    );
  }
}