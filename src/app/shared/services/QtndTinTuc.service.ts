import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { IChiTietTinTuc, IChiTietTinTucQueryParams, INhomTinTuc, INhomTinTucQueryParams, ITinTuc, ITinTucQueryParams } from '../types/tintuc';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/tintuc')
@Stoppable()
export class QtndTinTucService extends _HttpRequestInjector {

  qtndTtTinTuc(queryParams: ITinTucQueryParams & {bsThuvienId: string}) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndTtTinTuc',
      queryObject: queryParams,
    });
    return this._http.get<IResponse<ITinTuc[]>>(url);
  }

  qtndTtNhomTinTuc(queryParams: INhomTinTucQueryParams & {bsThuvienId: string}) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndTtNhomTinTuc',
      queryObject: queryParams,
    });
    return this._http.get<IResponse<INhomTinTuc[]>>(url);
  }

  ChiTietTinTuc(id: string, bsThuVienId: string) {
  const url = this.urlObject.buildUrl({
    endpoint: 'qtndTtTinTuc',
    queryObject: { id, bsThuVienId }
  });
      // console.log('url api video ct',url)

  return this._http.get<IResponse<IChiTietTinTuc[]>>(url);
}


qtndTtTinTucAudio(queryParams: ITinTucQueryParams & {bsThuvienId: string}) {
  const url = this.urlObject.buildUrl({
    endpoint: 'qtndTtTinTucAudio',
    queryObject: queryParams
  });
      // console.log('url api audio ct',url)

  return this._http.get<IResponse<IChiTietTinTuc[]>>(url);
}

qtndTtTinTucVideo(queryParams: ITinTucQueryParams & {bsThuvienId: string}) {
  const url = this.urlObject.buildUrl({
    endpoint: 'qtndTtTinTucVideo',
    queryObject: queryParams
  });
      // console.log('url api video ct',url)

  return this._http.get<IResponse<IChiTietTinTuc[]>>(url);
}


  
}
