import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { IBoook, IPageParams, IResponse } from '@/app/shared/types/common';
import { Injectable } from '@angular/core';
import { IDocument } from './documents';

@Injectable()
@HttpRequestInjectable('/tailieu')
@Stoppable()
export class DocumentsService extends _HttpRequestInjector {
  // getDocsLatest(
  //   queryObject: IPageParams = {
  //     pageIndex: 0,
  //     pageSize: 10,
  //   }
  // ) {
  //   const url = this.urlObject.buildUrl({
  //     endpoint: 'bmTaiLieuMoiNhatDs',
  //     queryObject,
  //   });

  //   return this._http.get<IResponse<IBoook[]>>(url);
  // }

  getDocsDetails(id: string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuChiTiet',
      queryObject: {
        id,
      },
    });

    return this._http.get<IResponse<IDocument[]>>(url);
  }
}
