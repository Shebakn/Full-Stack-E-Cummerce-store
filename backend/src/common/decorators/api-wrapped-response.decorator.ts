import { Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

type ApiWrappedOptions = {
  statusCode?: number;
  message?: string;
  pagination?: boolean;
};

export const ApiWrappedResponse = <TModel extends Type<any>>(
  model?: TModel,
  options: ApiWrappedOptions = {},
) => {
  const statusCode = options.statusCode ?? 200;
  const message = options.message ?? 'success';
  const hasPagination = options.pagination ?? false;

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    if (model) {
      ApiExtraModels(model)(target, key, descriptor);
    }

    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          data: model
            ? { $ref: getSchemaPath(model) }
            : { type: 'null', nullable: true },

          meta: {
            type: 'object',
            nullable: true,
            properties: {
              message: {
                type: 'string',
                example: message,
              },

              ...(hasPagination && {
                pagination: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    page: { type: 'number', example: 1 },
                    limit: { type: 'number', example: 10 },
                    total: { type: 'number', example: 100 },
                    totalPages: { type: 'number', example: 10 },
                  },
                  required: ['page', 'limit', 'total', 'totalPages'],
                },
              }),
            },
            required: ['message'],
          },

          error: {
            type: 'object',
            nullable: true,
            example: null,
          },

          statusCode: {
            type: 'number',
            example: statusCode,
          },

          timestamp: {
            type: 'string',
            example: new Date().toISOString(),
          },
        },
      },
    })(target, key, descriptor);
  };
};