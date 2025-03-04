import { IPageParams } from '../types/common';

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
export const DEFAULT_PAGINATION_OPTION: IPageParams = {
  pageIndex: 1,
  pageSize: 10,
};

export const DEFAULT_PAGINATION_OPTIONS = [10, 20, 50, 100];
