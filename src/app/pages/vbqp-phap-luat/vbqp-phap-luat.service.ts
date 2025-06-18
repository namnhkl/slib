import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { ChiTietVanBan, ChiTietVanBanQueryParams, DanhSachVanBan, DanhSachVanBanQueryParams, IResVbqpPhapLuats, LoaiVanBan, LoaiVanBanQueryParams } from './type';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Observable } from 'rxjs';
interface VbqpPhapLuatsQueryObject extends IPageParams {
  id?: string;
  qtndTtNhomTinTucId?:string;
  ten?:string;
  bsThuvienId?:string
}
@Injectable()
@HttpRequestInjectable('/vanban')
@Stoppable()
export class VbqpPhapLuatService extends _HttpRequestInjector {
 
qtndDmLoaiVanBan(params: LoaiVanBanQueryParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndDmLoaiVanBan',
      queryObject: {
        ...{

        },
        ...params
      },
    });

    return this._http.get<IResponse<LoaiVanBan[]>>(url);
}

qtndNvVanBan(params: DanhSachVanBanQueryParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndNvVanBan',
      queryObject: {
        ...{

        },
        ...params
      },
    });

    return this._http.get<IResponse<DanhSachVanBan[]>>(url);
}

chiTietVanBan(params: ChiTietVanBanQueryParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndNvVanBan',
      queryObject: {
        ...{

        },
        ...params
      },
    });

    return this._http.get<IResponse<ChiTietVanBan[]>>(url);
}

}
