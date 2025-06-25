import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBsThuvien, IDangTaiLieu } from '@/app/pages/home/HomeSearchAdvanced/type';
import { environment } from 'environments/environment';
import { BsKho } from '@/app/interfaces/bskho.interface';
import { IqtndTtLienHe } from './footer';
import { CopyRight, CopyRightParams } from '../../types/tienichkhac';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/lienhe')
@Stoppable()
export class FooterService extends _HttpRequestInjector {

  maThuVien: string = environment.MA_THU_VIEN;

   getQtndTtLienHe(bsThuVienId:string,qtndHtNgonNguId?:string) {
      const url = this.urlObject.buildUrl({
        endpoint: 'qtndTtLienHe',
        queryObject: {
         bsThuVienId:bsThuVienId,
         qtndHtNgonNguId:qtndHtNgonNguId
        },
      });
      // console.log('sssss',url);
      return this._http.get<IResponse<IqtndTtLienHe[]>>(url);
    }
}
