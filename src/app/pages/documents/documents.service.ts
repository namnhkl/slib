import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Injectable } from '@angular/core';
import { IDocument, IDocumentQueryParams, imageUrlsBase64, TaiLieuChiTiet, TaiLieuMucLucChiTiet } from './documents';
import { Observable } from 'rxjs';

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

   getDocs(
    queryObject: IDocumentQueryParams = {
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

  stsTaiLieuChiTiet(id: string, ipClient:string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'stsTaiLieuChiTiet',
      queryObject: {
        id,
        ipClient
      },
    });
    return this._http.get<IResponse<TaiLieuChiTiet[]>>(url);
  }

  stsTaiLieuMucLucChiTiet(id:string, ipClient:string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'stsTaiLieuMucLucChiTiet',
      queryObject: {
        id,
        ipClient
      },
    });
    return this._http.get<IResponse<TaiLieuMucLucChiTiet[]>>(url);
  }
  
}
