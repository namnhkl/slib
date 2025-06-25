import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { GioiThieuChitietModel, GioiThieuChiTietParams, GioiThieuModel, GioiThieuParams } from '../types/gioithieu';


@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/gioithieu')
@Stoppable()

export class GioiThieuService extends _HttpRequestInjector {

  qtndGioiThieu(params: GioiThieuParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndGioiThieu',
      queryObject: {
        ...{
          pageIndex: 0,
          pageSize: 99999
        },
        ...params
      },
    });

    return this._http.get<IResponse<GioiThieuModel[]>>(url);
  }


   qtndGioiThieuChiTiet(params: GioiThieuChiTietParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndGioiThieuChiTiet',
      queryObject: {
        ...{

        },
        ...params
      },
    });
    // console.log('url gtct', url);
    return this._http.get<IResponse<GioiThieuChitietModel[]>>(url);
  }
}

