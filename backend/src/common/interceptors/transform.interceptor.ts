import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T | null;
  meta: {
    message?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } | null;
  error: {
    message: string;
    code?: string;
    details?: any;
  } | null;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response: any) => {
        const statusCode = res.statusCode;
        const timestamp = new Date().toISOString();

        const base = {
          statusCode,
          timestamp,
        };

        // =========================
        // 1. If response already has error (from filter)
        // =========================
        if (response?.error) {
          return {
            ...base,
            data: null,
            meta: response.meta ?? null,
            error: response.error,
          };
        }

        // =========================
        // 2. Pagination response
        // =========================
        if (response?.meta?.pagination) {
          return {
            ...base,
            data: response.data ?? null,
            meta: response.meta,
            error: null,
          };
        }

        // =========================
        // 3. Only message
        // =========================
        if (
          response?.message &&
          !response?.data &&
          !response?.meta
        ) {
          return {
            ...base,
            data: null,
            meta: {
              message: response.message,
            },
            error: null,
          };
        }

        // =========================
        // 4. Standard {data, meta}
        // =========================
        if (response?.data !== undefined) {
          return {
            ...base,
            data: response.data,
            meta: response.meta ?? null,
            error: null,
          };
        }

        // =========================
        // 5. Raw fallback
        // =========================
        return {
          ...base,
          data: response,
          meta: null,
          error: null,
        };
      }),
    );
  }
}