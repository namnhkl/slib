import { _HttpRequestInjector, HttpRequestInjectable } from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { IResNews } from './type';
import { IPageParams } from '@/app/shared/types/common';

@Injectable()
@HttpRequestInjectable('/tintuc')
@Stoppable()
export class NewsService extends _HttpRequestInjector {
  getNews(queryObject: IPageParams = {}) {
    const url = this.urlObject.buildUrl({ endpoint: 'qtndTtTinTuc', queryObject })

    return this._http.get<IResNews>(url)
  }
}
