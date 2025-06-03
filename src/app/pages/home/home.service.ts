import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Injectable } from '@angular/core';
import { IBookSearchResponse, IDangTaiLieu } from './HomeSearchAdvanced/type';

@Injectable()
@HttpRequestInjectable('/tailieu')
@Stoppable()
export class HomeService extends _HttpRequestInjector {
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

    return this._http.get<IBookSearchResponse>(url);
  }

  searchDocs(
    queryObject: IPageParams & any
  ) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuMoiNhatDs',
      queryObject,
    });

    return this._http.get<IBookSearchResponse>(url);
  }

  bmTaiLieuMoiNhatDs(queryObject: IPageParams & { bmDmDangTaiLieuId: string }) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuMoiNhatDs',
      queryObject,
    });
    return this._http.get<IBookSearchResponse>(url);
  }



}
