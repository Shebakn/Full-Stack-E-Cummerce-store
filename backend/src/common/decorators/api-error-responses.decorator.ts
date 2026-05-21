import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;

export const ApiErrorResponses = (statuses?: ErrorStatus[]) => {
  const all = {
    400: {
      description: 'Bad Request',
      example: {
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
        },
        statusCode: 400,
      },
    },
    401: {
      description: 'Unauthorized',
      example: {
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
        statusCode: 401,
      },
    },
    404: {
      description: 'Not Found',
      example: {
        error: {
          message: 'Not found',
          code: 'NOT_FOUND',
        },
        statusCode: 404,
      },
    },
    409: {
      description: 'Conflict',
      example: {
        error: {
          message: 'Duplicate',
          code: 'P2002',
        },
        statusCode: 409,
      },
    },
    500: {
      description: 'Internal Error',
      example: {
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        statusCode: 500,
      },
    },
  };

  const selected = statuses ?? Object.keys(all);

  return applyDecorators(
    ...selected.map((status) =>
      ApiResponse({
        status: Number(status),
        description: all[status as keyof typeof all].description,
        schema: {
          example: {
            data: null,
            meta: null,
            ...all[status as keyof typeof all].example,
            timestamp: new Date().toISOString(),
          },
        },
      }),
    ),
  );
};