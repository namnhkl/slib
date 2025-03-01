import { storage } from '@/app/utils';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '../@decorator/api/http-request.decorator';
import { Stoppable } from '../@decorator/stoppable.decorator';

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
  constructor(private router: Router) {
    super();
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

  saveSession(data: IResponseAuthData, accessToken: string): void {
    storage.setItem('appSession', data);
    storage.setItem('access_token', accessToken);
    this.isAuthenticated$.next(true);
  }

  logout(): void {
    storage.removeItem('appSession');
    storage.removeItem('access_token');
    this.isAuthenticated$.next(false);
    //redirect to home after logout
    this.router.navigate(['/']);
  }
}
