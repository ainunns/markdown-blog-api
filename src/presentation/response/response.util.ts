export type SuccessResponse<T> = {
  data: T;
  message: string;
  status: true;
};

export type SuccessResponseWithPagination<T> = SuccessResponse<T> & {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ErrorResponse = {
  error: string;
  status: false;
};

export function success<T>(data: T, message = 'OK'): SuccessResponse<T> {
  return { status: true, message, data } as const;
}

export function successWithPagination<T>(
  data: T,
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  },
  message = 'OK',
): SuccessResponseWithPagination<T> {
  return {
    status: true,
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    },
  } as const;
}

export function failure(error: string): ErrorResponse {
  return { status: false, error } as const;
}
