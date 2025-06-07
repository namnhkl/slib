import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBsThuvien, IDangTaiLieu } from '@/app/pages/home/HomeSearchAdvanced/type';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/danhmuc')
@Stoppable()
export class DanhmucService extends _HttpRequestInjector {


  getPdf(p: string) {
    // Gọi trực tiếp URL p đã được decode
    return this._http.get<Blob>(p, {
      responseType: 'blob' as 'json',
    });
  }

  getPdfAsImages(pdfUrl: string): Observable<string[]> {
  return this._http.post<string[]>('https://localhost:7083/api/Magazine/pdf-as-base64', pdfUrl);
}

   bmDmDangTaiLieu() {
      const url = this.urlObject.buildUrl({
        endpoint: 'bmDmDangTaiLieu',
        queryObject: {
         
        },
      });
      return this._http.get<IResponse<IDangTaiLieu[]>>(url);
    }

    getThuvien() {
      const url = this.urlObject.buildUrl({
        endpoint: 'bsThuVien',
        queryObject: {
         
        },
      });
      return this._http.get<IResponse<IBsThuvien[]>>(url);
    }
  
}
