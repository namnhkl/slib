import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { HttpStoppable } from '../@decorator/type.decorator';
import { HttpRequestInjectable } from '../@decorator/api/http-request.decorator';
import { Stoppable } from '../@decorator/stoppable.decorator';

export interface IResponseDocuments {
  messageCode: number;
  messageText: string;
  data: IData[];
  totalRecord: number;
}

export interface IData {
  id: string;
  anhDaiDien?: string;
  tieuDe: string;
  tacGia: TacGum[];
  thongTinXuatBan: string;
  slBanIn: number;
  slBanSo: number;
  slXem: number;
  diemDanhGia: number;
}

export interface TacGum {
  giaTri: string;
}
@Injectable()
@HttpRequestInjectable('/tailieu')
@Stoppable()
export class DocumentService extends HttpStoppable {

  getAllDocuments(params?: { pageIndex: number; pageSize: number; tieuDe: string; tacGia: string }): Observable<IResponseDocuments> {
    // return this.http.get<IResponseDocuments>('https://api.demo.slib.vn:6787/api/thuvien/tailieu/bmTaiLieuDs', {
    //   params,
    // });
    return this._http.get<IResponseDocuments>(this.urlObject.buildUrl({
      endpoint: 'bmTaiLieuDs',
      queryObject: params
    }));
  }
}
