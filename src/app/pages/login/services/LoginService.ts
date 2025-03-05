import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginModel } from '../model/login-model';
import { HttpRequestInjectable, _HttpRequestInjector } from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/auth')
@Stoppable()
export class LoginService extends _HttpRequestInjector {
  login(body: LoginModel): Observable<HttpResponse<any>> {
    return this._http.post<any>(
      this.urlObject.baseUrl,
      body,
      { observe: 'response' },
    );
  }
}
