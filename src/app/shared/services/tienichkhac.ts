import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HtThanhChucNang, ThanhChucNangParams } from '../types/tienichkhac';


@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/tienichkhac')
@Stoppable()

export class TienIchKhacService extends _HttpRequestInjector {
  qtndQlThanhChucNang(params: ThanhChucNangParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndQlThanhChucNang',
      queryObject: {
        ...{
          pageIndex: 0,
          pageSize: 99999
        },
        ...params
      },
    });

    return this._http.get<IResponse<HtThanhChucNang[]>>(url);
  }
}

