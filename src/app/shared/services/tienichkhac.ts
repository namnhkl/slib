import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { IResponse } from '@/app/shared/types/common';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ChiTietAnhQuery, CopyRight, CopyRightParams, DanhMucAnh, DanhMucAnhQuery, HtThanhChucNang, QtndHtThanhChucNangItem, QtndHtThanhChucNangParams, ThanhChucNangParams, ThongKeTruyCap, ThongKeTruyCapParams, ThuVienAnhChiTiet } from '../types/tienichkhac';


@Injectable({
  providedIn: 'root',
})
@HttpRequestInjectable('/tienichkhac')
@Stoppable()

export class TienIchKhacService extends _HttpRequestInjector {
  qtndQlThanhChucNang(params: ThanhChucNangParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndQlThanhChucNang',
      queryObject: {
        ...{
          pageIndex: 0,
          pageSize: 99999
        },
        ...params
      },
    });

    return this._http.get<IResponse<HtThanhChucNang[]>>(url);
  }

    qtndQlFooterCopyright(params: CopyRightParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndQlFooterCopyright',
      queryObject: {
        ...{
          pageIndex: 0,
          pageSize: 99999
        },
        ...params
      },
    });
    // console.log('url copy', url);
    return this._http.get<IResponse<CopyRight[]>>(url);
  }

    thongKeTruyCap(params: ThongKeTruyCapParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'thongKeTruyCap',
      queryObject: {
        ...{
        },
        ...params
      },
    });
    return this._http.get<IResponse<ThongKeTruyCap>>(url);
  }

  getMenu(params: QtndHtThanhChucNangParams) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndQlThanhChucNang',
      queryObject: {
        ...{
          pageIndex: 0,
          pageSize: 99999
        },
        ...params
      },
    });
    // console.log('url menu', url);
    return this._http.get<IResponse<QtndHtThanhChucNangItem[]>>(url);
  }

    getDanhMucAnh(params: DanhMucAnhQuery) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndGtThuVienAnh',
      queryObject: {
        ...{
          pageIndex: 0,
          pageSize: 99999
        },
        ...params
      },
    });
    // console.log('url anh', url);
    return this._http.get<IResponse<DanhMucAnh[]>>(url);
  }

  
    getAnhChiTiet(params: ChiTietAnhQuery) {
    const url = this.urlObject.buildUrl({
      endpoint: 'qtndGtThuVienAnhChiTiet',
      queryObject: {
        ...{
        },
        ...params
      },
    });
    // console.log('url anh chi tiet', url);
    return this._http.get<IResponse<ThuVienAnhChiTiet[]>>(url);
  }
}

