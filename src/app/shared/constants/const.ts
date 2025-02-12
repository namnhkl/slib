import { PaginatorParams } from '../models';

export const TYPE_MES = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
};

export const TYPE_MODAL = {
  add: 'add',
  edit: 'edit',
};

export const Status = {
  SuDung: 'Sử dụng',
  KhongSD: 'Không sử dụng',
};

/**
 * page: 1,
  pageSize: 100000,
  pageNumber: 1,
 */
export const DEFAULT_PAGINATION_OPTION: PaginatorParams = {
  page: 1,
  pageSize: 100000,
  pageNumber: 1,
};
