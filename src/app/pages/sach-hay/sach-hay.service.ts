import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { DanhMucSachHay, QueryDanhMucSachHayParams, QuerySachHayParams, SachHay } from './type';
import { IResponse } from '@/app/shared/types/common';

@Injectable()
@HttpRequestInjectable('/tintuc')
@Stoppable()
export class SachHayService extends _HttpRequestInjector {
 
  getDanhMucSachHay(params: QueryDanhMucSachHayParams) {
      const url = this.urlObject.buildUrl({
            endpoint: 'qtndNvThuMuc',
            queryObject: params,
          });
        return this._http.get<IResponse<DanhMucSachHay[]>>(url);
  }

    getSachHayChiTiet(params: QuerySachHayParams) {
          const url = this.urlObject.buildUrl({
            endpoint: 'qtndNvThuMuc',
            queryObject: params,
          });
          return this._http.get<IResponse<SachHay[]>>(url);
        }

}
