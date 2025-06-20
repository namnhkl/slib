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
import { IBoSach, IBoSachParams, IqtndDmLoaiThuMuc } from '../types/danhmuc';

@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/danhmuc')
@Stoppable()
export class DanhmucService extends _HttpRequestInjector {

  maThuVien: string = environment.MA_THU_VIEN;

  getPdf(p: string) {
    // Gọi trực tiếp URL p đã được decode
    return this._http.get<Blob>(p, {
      responseType: 'blob' as 'json',
    });
  }

   bmDmDangTaiLieu(bsThuVienId:string) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bmDmDangTaiLieu',
        queryObject: {
         bsThuVienId:bsThuVienId
        },
      });
      return this._http.get<IResponse<IDangTaiLieu[]>>(url);
    }

    getThuvien() {
      const url = this.urlObject.buildUrl({
        endpoint: 'bsThuVien',
        queryObject: {
         ma: this.maThuVien
        },
      });
      return this._http.get<IResponse<IBsThuvien[]>>(url);
    }

    getKho(bsThuVienId: string) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bsKho',
        queryObject: {
         bsThuVienId: bsThuVienId
        },
      });
      return this._http.get<IResponse<BsKho[]>>(url);
    }
  
     getBoSach(params: IBoSachParams) {
        const url = this.urlObject.buildUrl({
          endpoint: 'bmTuDienBoSach',
          queryObject: {
            params
          },
        });
        return this._http.get<IResponse<IBoSach[]>>(url);
      }

        
     getLoaiThuMuc() {
        const url = this.urlObject.buildUrl({
          endpoint: 'qtndDmLoaiThuMuc',
          queryObject: {
           
          },
        });
        return this._http.get<IResponse<IqtndDmLoaiThuMuc[]>>(url);
      }
}
