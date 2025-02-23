import { storage } from '@/app/utils';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { _HttpRequestInjector, HttpRequestInjectable } from '../@decorator/api/http-request.decorator';
import { Stoppable } from '../@decorator/stoppable.decorator';


interface LoginModel {
  userName: string;
  password: string;
  rememberMe: boolean;
}
@Injectable({
  providedIn: 'root',
})

@HttpRequestInjectable('/bandoc')
@Stoppable()
export class AuthService extends _HttpRequestInjector {
  isAuthenticated$ = new BehaviorSubject<boolean>(
    !!storage.getItem('appSession')
  );

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  login(body: LoginModel): void {
    this._http.post('/bdBanDocDangNhap', body).subscribe((res: any) => {
      console.log("🚀 ~ AuthService ~ this._http.post ~ res:", res)
      storage.setItem('appSession', { user: '{id: 1, name: abc}' });
      storage.setItem('access_token', 'xxx');
      this.isAuthenticated$.next(true);
    });
  }

  logout(): void {
    storage.removeItem('appSession');
    storage.removeItem('access_token');
    this.isAuthenticated$.next(false);
  }
}
