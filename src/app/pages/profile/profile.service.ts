import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/bandoc')
@Stoppable()
export class ProfileService extends _HttpRequestInjector {
  banDocLtMuonTraBmTaiLieu(queryObject: IPageParams = {
    pageIndex: 0,
    pageSize: 10
  }) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bdBanDocLtMuonTraBmTaiLieu',
      queryObject,
    });

    return this._http.get<IResponse<any[]>>(url);
  }

  bdBanDocBmTaiLieuQuanTamThemMoi(id: string ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bdBanDocBmTaiLieuQuanTamThemMoi'
      });
      return this._http.post<IResponse<any[]>>(url, { id });

    }

    bdBanDocBmTaiLieuQuanTamXoa(id: string ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bdBanDocBmTaiLieuQuanTamXoa'
      });
      return this._http.post<IResponse<any[]>>(url, { id });

    }
}
