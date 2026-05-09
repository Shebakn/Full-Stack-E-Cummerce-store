import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes } from '../errors/error-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const timestamp = new Date().toISOString();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: string = ErrorCodes.INTERNAL_ERROR;
    let details: any = null;

    // =========================
    // HttpException
    // =========================
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const response = exception.getResponse();

      // =========================
      // CASE 1: string
      // =========================
      if (typeof response === 'string') {
        message = response;
      }

      // =========================
      // CASE 2: object
      // =========================
      else if (typeof response === 'object') {
        const r: any = response;

        // 🔥 Validation errors (class-validator)
        if (Array.isArray(r.message)) {
          message = 'Validation failed';
          code = 'VALIDATION_ERROR';

          const formatted: Record<string, string> = {};

          r.message.forEach((msg: string) => {
            const field = msg.split(' ')[0];
            formatted[field] = msg;
          });

          details = formatted;
        }

        // 🔥 Custom structured error
        else {
          message = r.message || message;
          code = r.code || code;
          details = r.details ?? null;
        }
      }
    }

    // =========================
    // Unknown error
    // =========================
    else {
      message = exception?.message || message;
    }

    // =========================
    // Final response
    // =========================
    res.status(status).json({
      data: null,
      meta: null,
      error: {
        message,
        code,
        details,
      },
      statusCode: status,
      timestamp,
    });
  }
}