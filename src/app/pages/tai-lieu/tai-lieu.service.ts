import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Injectable } from '@angular/core';
import { DsBanIn, IDocument, IDocumentQueryParams, imageUrlsBase64, TaiLieuChiTiet, TaiLieuMucLucChiTiet, ThongKeTaiLieuThuVien, ThongKeTaiLieuThuVienQueryParams } from './tai-lieu';
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
    console.log('bmTaiLieuDs url', url);
    return this._http.get<IResponse<IDocument[]>>(url);
  }

  getDocsDetails(id: string,bsThuVienId: string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuChiTiet',
      queryObject: {
        id,
        bsThuVienId
      },
    });
    return this._http.get<IResponse<IDocument[]>>(url);
  }

  getDKCBs(bsThuVienId: string, bmTaiLieuId:string, bsKhoId?:string, maDkcb?:string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuDkcb',
      queryObject: {
        bsThuVienId: bsThuVienId,
        bmTaiLieuId: bmTaiLieuId,
        bsKhoId: bsKhoId,
        maDkcb:maDkcb
      },
    });
    console.log('url dkcb:', url);
    return this._http.get<IResponse<DsBanIn[]>>(url);
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

  bmTaiLieuTheoStsBoSuuTap(stsBoSuuTapId: string, bsThuVienId:string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuTheoStsBoSuuTap',
      queryObject: {
        stsBoSuuTapId: stsBoSuuTapId,
        bsThuVienId: bsThuVienId,
      },
    });
    console.log('url list book', url);
    return this._http.get<IResponse<TaiLieuChiTiet[]>>(url);
  }

    stsTaiLieuChiTiet(id: string, ipClient:string,bsThuVienId: string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'stsTaiLieuChiTiet',
      queryObject: {
        id,
        ipClient,
        bsThuVienId
      },
    });
    return this._http.get<IResponse<TaiLieuChiTiet[]>>(url);
  }

  stsTaiLieuMucLucChiTiet(id:string, ipClient:string, bsThuVienId: string) {
    const url = this.urlObject.buildUrl({
      endpoint: 'stsTaiLieuMucLucChiTiet',
      queryObject: {
        id,
        ipClient,
        bsThuVienId
      },
    });
    return this._http.get<IResponse<TaiLieuMucLucChiTiet[]>>(url);
  }

    bmTaiLieuThongKeTrangChu(params: ThongKeTaiLieuThuVienQueryParams) {
              const url = this.urlObject.buildUrl({
                endpoint: 'bmTaiLieuThongKeTrangChu',
                queryObject: params,
              });
              return this._http.get<IResponse<ThongKeTaiLieuThuVien>>(url);
            }
  
}
