import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Injectable } from '@angular/core';
import { IDocument, IDocumentQueryParams, imageUrlsBase64, TaiLieuChiTiet, TaiLieuMucLucChiTiet } from './tai-lieu';
import { Observable } from 'rxjs';
import { IChuyenDe } from '../stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de.type';

@Injectable({
  providedIn: 'root' // Đảm bảo có dòng này
})
@HttpRequestInjectable('/tailieu')
@Stoppable()
export class TaiLieuService extends _HttpRequestInjector {
  getDocsLatest(
    queryObject: IPageParams & {
      bsThuvienId: string
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
console.log('Query URL:', url);
    return this._http.get<IResponse<IDocument[]>>(url);
  }

     bmTaiLieuDs(
    queryObject: IDocumentQueryParams = {
    }
  ) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuDs',
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

  getChuyenDes(bsThuVienId: string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'stsBoSuuTapDs',
      queryObject: {
        bsThuVienId: bsThuVienId
      },
    });
    return this._http.get<IResponse<IChuyenDe[]>>(url);
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
