import { HttpErrorResponse } from '@angular/common/http';

export interface HttpResponseData<D = unknown> {
  count: number;
  page: number;
  pages: number;
  results: D;
  total: number;
  totalPages: number;
  status: boolean;
  message: string;
  success: boolean;
  result: any;
  fileName: string;
}

export interface HttpResponseLg {
  username: string;
  accessToken: string;
  tokenType: string;
  expireTime: string;
}

export interface AppHttpError extends HttpErrorResponse {
  error: {
    type: number;
    title: string;
    status: number;
    detail: string;
    errors?: AppError[];
  };
}

export interface AppError {
  code: string;
  message: string;
  type: number;
}
