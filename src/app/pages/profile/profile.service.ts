import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { DanhSachTaiLieuDatMuon, IDanhSachTaiLieuDatMuonParams } from '../tai-lieu/tai-lieu';

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

    bdBanDocDoiMatKhau(matKhauCu: string, matKhau: string ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bdBanDocDoiMatKhau'
      });
      return this._http.post<IResponse<any[]>>(url, { matKhauCu: matKhauCu, matKhau: matKhau });
    }

    bdBanDocDangKyMuon(id: string ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bdBanDocDangKyMuon'
      });
      return this._http.post<IResponse<any[]>>(url, { id });

    }

    bdBanDocDangKyMuonXoa(id: string ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bdBanDocDangKyMuonXoa'
      });
      return this._http.post<IResponse<any[]>>(url, { id });

    }

    bdBanDocLtDangKyMuonDs(queryObject: IDanhSachTaiLieuDatMuonParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'bdBanDocLtDangKyMuonDs',
      queryObject,
    });

    return this._http.get<IResponse<DanhSachTaiLieuDatMuon[]>>(url);
  }
}
