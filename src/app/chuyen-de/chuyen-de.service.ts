// src/app/chuyen-de/chuyen-de.service.ts
import {
    _HttpRequestInjector,
    HttpRequestInjectable,
  } from '@/app/shared/@decorator/api/http-request.decorator';
  import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
  import { IPageParams } from '@/app/shared/types/common';
  import { Injectable } from '@angular/core';
  import { IChuyenDeResponse } from './chuyen-de.type';
  
  @Injectable({
    providedIn: 'root'
  })
  @HttpRequestInjectable('/tailieu')
  @Stoppable()
  export class ChuyenDeService extends _HttpRequestInjector {
    getChuyenDeList(
      queryObject: IPageParams & { tieuDe?: string } = {
        pageIndex: 0,
        pageSize: 10
      }
    ) {
      const url = this.urlObject.buildUrl({
        endpoint: 'stsBoSuuTapDs',
        queryObject,
      });
  
      return this._http.get<IChuyenDeResponse>(url);
    }
  }