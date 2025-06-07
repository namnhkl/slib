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

export class DangKyTaiKhoanRequest {
  bsThuVienId!: string;
  hoTen!: string;
  gioiTinh!: number;
  ngaySinh!: string; // dạng 'dd/MM/yyyy'
  email!: string;
  dienThoai?: string;
  bdDmQuocGiaId?: string;
  bdDmTinhThanhId?: string;
  diaChi?: string;
  bdDmDanTocId?: string;
  bdDmTrinhDoVanHoaId?: string;
  bdDmNgheNghiepId?: string;
  bdDmThanhPhanXaHoiId?: string;
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

// Observable để theo dõi trạng thái đăng nhập
isAuthenticated$ = new BehaviorSubject<boolean>(
  !!(localStorage.getItem('appSession') || sessionStorage.getItem('appSession'))
);

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  login(body: LoginModel) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocDangNhap' });

    return this._http.post<IResponseAuth>(url, body);
  }

  quenMatKhauLayMaBaoMat(body: { soThe: string; email: string }) {
    const url = this.urlObject.buildUrl({ endpoint: 'quenMatKhauLayMaBaoMat' });
    return this._http.post<IResponse<any>>(url, body);
  }

  xacNhanMaBaoMat(body: { maBaoMat: string; email: string }) {
    const url = this.urlObject.buildUrl({ endpoint: 'quenMatKhauXacNhanMaBaoMat' });
    return this._http.post<IResponse<any>>(url, body);
  }

  doiMatKhau(body: { maBaoMat: string; email: string; matKhau: string }) {
    const url = this.urlObject.buildUrl({ endpoint: 'quenMatKhauDoiMatKhau' });
    return this._http.post<IResponse<any>>(url, body);
  }



dangKyTaiKhoan(body: DangKyTaiKhoanRequest) {
  const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocThemMoi' });
  return this._http.post<IResponse<any>>(url, body);
}


  //Lịch sử mượn tài liệu in
  getCirHistoryItem(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraBmTaiLieu', queryObject });
    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

//Đang mượn tài liệu số
getDangMuonTaiLieuSo(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraDangMuonStsTaiLieu', queryObject });
    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }
  
//Lịch sử tls
  countReadBooks(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraStsTaiLieu', queryObject });
    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

  //Đang mượn tài liệu in
  getBorrowedDocuments(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocLtMuonTraDangMuonBmTaiLieu', queryObject });

    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

  //Yêu thích
  getFavoriteDocuments(queryObject: IPageParams = this.defaultPageParams) {
    const url = this.urlObject.buildUrl({ endpoint: 'bdBanDocBmTaiLieuQuanTam', queryObject });

    return this._http.get(url).pipe(this.pipeGetFinalResult() as any);
  }

// Hàm lưu session: thêm tham số 'rememberMe'
saveSession(data: IResponseAuthData, accessToken: string, rememberMe: boolean): void {
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem('appSession', JSON.stringify(data));
  storage.setItem('access_token', JSON.stringify(accessToken));
  this.isAuthenticated$.next(true);
}

// Hàm đăng xuất: xóa cả hai nơi lưu
logout(): void {
  localStorage.removeItem('appSession');
  localStorage.removeItem('access_token');

  sessionStorage.removeItem('appSession');
  sessionStorage.removeItem('access_token');

  this.isAuthenticated$.next(false);
}

setRedirectUrl(url: string) {
  localStorage.setItem('redirectUrl', url);
}

// AuthService
getRedirectUrl(): string | null {
  const url = localStorage.getItem('redirectUrl');
  // Xóa sau khi dùng để tránh redirect lặp
  localStorage.removeItem('redirectUrl');
  return url;
}

}
