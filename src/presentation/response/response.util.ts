export type SuccessResponse<T> = {
  data: T;
  message: string;
  status: true;
};

export type ErrorResponse = {
  error: string;
  status: false;
};

export function success<T>(data: T, message = 'OK'): SuccessResponse<T> {
  return { status: true, message, data } as const;
}

export function failure(error: string): ErrorResponse {
  return { status: false, error } as const;
}
