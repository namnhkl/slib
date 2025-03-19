import { _HttpRequestInjector, HttpRequestInjectable } from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { IPageParams, IResponse } from '@/app/shared/types/common';

export interface IOptionCategory {
  id: string;
  ma: string;
  ten: string;
  diaChi: string;
  lienHe: string;
  sapXep: number;
}


@Injectable()
@HttpRequestInjectable('/danhmuc')
@Stoppable()
export class CategoryService extends _HttpRequestInjector {
  getCategory(queryObject: IPageParams = {}) {
    const url = this.urlObject.buildUrl({ endpoint: 'bsThuVien', queryObject })

    return this._http.get<IResponse<IOptionCategory[]>>(url)
  }
}
