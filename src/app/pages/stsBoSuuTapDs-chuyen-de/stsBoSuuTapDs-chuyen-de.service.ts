// src/app/chuyen-de/chuyen-de.service.ts
import {
    _HttpRequestInjector,
    HttpRequestInjectable,
  } from '@/app/shared/@decorator/api/http-request.decorator';
  import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
  import { Injectable } from '@angular/core';
  import { IChuyenDe, IChuyenDeResponse } from './stsBoSuuTapDs-chuyen-de.type';
  import { IDocument } from '../tai-lieu/tai-lieu';
  import { IPageParams, IResponse } from '@/app/shared/types/common';
import { Observable } from 'rxjs';
  @Injectable({
    providedIn: 'root'
  })
  @HttpRequestInjectable('/tailieu')
  @Stoppable()
  export class stsBoSuuTapDsChuyenDeService extends _HttpRequestInjector {
    getChuyenDeList(
      queryObject: IPageParams & { tieuDe?: string, bsThuvienId: string }
    ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'stsBoSuuTapDs',
        queryObject,
      });
  
      return this._http.get<IChuyenDeResponse>(url);
    }

    getChuyenDeById(
      queryObject: IPageParams & { id?: string,bsThuvienId: string }
    ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'stsBoSuuTapDs',
        queryObject,
      });
  
      return this._http.get<IResponse<IChuyenDe[]>>(url);
    }

    getChuyenDeItem(
      queryObject: IPageParams &  {stsBoSuuTapId?: string; tieuDe?: string,bsThuvienId: string }
    ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'bmTaiLieuTheoStsBoSuuTap',
        queryObject,
      });
  
      return this._http.get<IResponse<IDocument[]>>(url);
    }
  }