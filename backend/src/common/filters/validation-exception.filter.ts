import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const response: any = exception.getResponse();
    const timestamp = new Date().toISOString();

    const details: Record<string, any> = {};

    const errors = response?.message;

    // =========================
    // class-validator array
    // =========================
    if (Array.isArray(errors)) {
      errors.forEach((err: any) => {
        const field = err?.property;
        if (!field) return;

        const message = err?.constraints
          ? Object.values(err.constraints).join(', ')
          : 'Invalid value';

        details[field] = message;
      });
    }

    // =========================
    // string fallback
    // =========================
    else if (typeof errors === 'string') {
      details.general = errors;
    }

    res.status(400).json({
      data: null,
      meta: null,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      },
      statusCode: 400,
      timestamp,
    });
  }
}