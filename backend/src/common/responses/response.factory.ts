export class ResponseFactory {
  // =========================
  // Success (no message)
  // =========================
  static success<T>(data: T) {
    return {
      data,
      meta: null,
    };
  }

  // =========================
  // Success with message
  // =========================
  static successWithMessage<T>(data: T, message: string) {
    return {
      data,
      meta: {
        message,
      },
    };
  }

  // =========================
  // Only message
  // =========================
  static onlyMessage(message: string) {
    return {
      data: null,
      meta: {
        message,
      },
    };
  }

  // =========================
  // Pagination
  // =========================
  static pagination<T>(
    data: T[],
    options: {
      page: number;
      limit: number;
      total: number;
    },
    message = 'success',
  ) {
    return {
      data,
      meta: {
        message,
        pagination: {
          page: options.page,
          limit: options.limit,
          total: options.total,
          totalPages: Math.ceil(options.total / options.limit),
        },
      },
    };
  }

  // =========================
  // Error wrapper (optional use in service)
  // =========================
  static error(message: string, code = 'ERROR', details: any = null) {
    return {
      data: null,
      meta: null,
      error: {
        message,
        code,
        details,
      },
    };
  }
}