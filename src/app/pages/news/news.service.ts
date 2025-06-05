import {
  _HttpRequestInjector,
  HttpRequestInjectable,
} from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { IResNews } from './type';
import { IPageParams } from '@/app/shared/types/common';
import { Observable } from 'rxjs';
interface INewsQueryObject extends IPageParams {
  id?: string;
  qtndTtNhomTinTucId?:string;
}
@Injectable()
@HttpRequestInjectable('/tintuc')
@Stoppable()
export class NewsService extends _HttpRequestInjector {
 getNews(queryObject: INewsQueryObject): Observable<IResNews>;
getNews(pageIndex: number, pageSize: number, queryObject?: INewsQueryObject): Observable<IResNews>;
getNews(
  arg1: number | INewsQueryObject,
  arg2?: number,
  arg3: INewsQueryObject = {}
): Observable<IResNews> {
  let query: INewsQueryObject;

  if (typeof arg1 === 'object') {
    query = arg1;
  } else {
    query = {
      ...arg3,
      pageIndex: arg1,
      pageSize: arg2
    };
  }

  const url = this.urlObject.buildUrl({
    endpoint: 'qtndTtTinTuc',
    queryObject: query,
  });
  console.log('url',url);
  return this._http.get<IResNews>(url);
}
}
