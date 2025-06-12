import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAnhQuangCao } from '@/app/pages/home/HomeSearchAdvanced/type';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/nhacviec')
@Stoppable()
export class NhacViecService extends _HttpRequestInjector {

   qtndQlQuangCao(bsThuVienId: string) {
      const url = this.urlObject.buildUrl({
        endpoint: 'qtndQlQuangCao',
        queryObject: {
         bsThuVienId: bsThuVienId
        },
      });
      return this._http.get<IResponse<IAnhQuangCao[]>>(url);
    }
    
}
