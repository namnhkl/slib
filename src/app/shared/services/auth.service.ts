import { storage } from '@/app/utils';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '../@decorator/api/http-request.decorator';
import { Stoppable } from '../@decorator/stoppable.decorator';
import { BookRead, IPageParams, IResponse } from '../types/common';

export interface IResponseAuth {
  accessToken: string;
  messageCode: number;
  messageText: string;
  data: IResponseAuthData[];
}

export interface IResponseAuthData {
  id: string;
  bsThuVienTen: string;
  bdNhomTen: string;
  soThe: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  email: string;
  dienThoai: string;
  anhDaiDien: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  ngayKhoaTheTu: string;
  ngayKhoaTheDen: string;
  diaChi: string;
  nguoiLienHe: string;
}




interface LoginModel {
  soThe: string;
  matKhau: string;
}
@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/bandoc')
@Stoppable()
export class AuthService extends _HttpRequestInjector {
  defaultPageParams = { pageIndex: 0, pageSize: 50 };

  constructor(private router: Router) {
    super();
  }

  pipeGetFinalResult() {
    return map((res: IResponse<BookRead[]>) => {
      if (res.messageCode === 1) {
        return {
          totalRecord: res.totalRecord,
          data: res.data,
        }
      }

      return {
        totalRecord: null,
        data: [],
      }
    })
  }

  isAuthenticated$ = new BehaviorSubject<boolean>(
    !!storage.getItem('appSession')
  );

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  login(body: LoginModel) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocDangNhap' });

    return this._http.post<IResponseAuth>(url, body);
  }

  countBorrowedBooks(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraBmTaiLieu', queryObject });
    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

  countReadBooks(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraStsTaiLieu', queryObject });

return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

  getBorrowedDocuments(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraDangMuonBmTaiLieu', queryObject });

    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

  getFavoriteDocuments(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocBmTaiLieuQuanTam', queryObject });

    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

  saveSession(data: IResponseAuthData, accessToken: string): void {
    storage.setItem('appSession', data);
    storage.setItem('access_token', accessToken);
    this.isAuthenticated$.next(true);
  }

  logout(): void {
    storage.removeItem('appSession');
    storage.removeItem('access_token');
    //redirect to home after logout
    // this.router.navigate(['/']);
    this.isAuthenticated$.next(false);
  }
}
