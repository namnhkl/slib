import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Injectable } from '@angular/core';
import { IDocument } from './documents';

@Injectable({
  providedIn: 'root' // Đảm bảo có dòng này
})
@HttpRequestInjectable('/tailieu')
@Stoppable()
export class DocumentsService extends _HttpRequestInjector {
  getDocsLatest(
    queryObject: IPageParams = {
      pageIndex: 0,
      pageSize: 10,
    }
  ) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuMoiNhatDs',
      queryObject,
    });

    return this._http.get<IResponse<IDocument[]>>(url);
  }

  getDocsDetails(id: string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuChiTiet',
      queryObject: {
        id,
      },
    });
    return this._http.get<IResponse<IDocument[]>>(url);
  }

  getChuyenDes() {
    const url = this.urlObject.buildUrl({
      endpoint: 'stsBoSuuTapDs',
      queryObject: {

      },
    });
    return this._http.get<IResponse<IDocument[]>>(url);
  }
}
