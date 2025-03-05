import { _HttpRequestInjector, HttpRequestInjectable } from '@/app/shared/@decorator/api/http-request.decorator';
import { Stoppable } from '@/app/shared/@decorator/stoppable.decorator';
import { Injectable } from '@angular/core';
import { IPageParams } from '@/app/shared/types/common';
import { ContactFormBody, IContactDetailResponse } from './type';

@Injectable()
@HttpRequestInjectable('/lienhe')
@Stoppable()
export class ContactService extends _HttpRequestInjector {
  getDetailContact(queryObject: IPageParams = {}) {
    const url = this.urlObject.buildUrl({ endpoint: 'qtndTtLienHe', queryObject })

    return this._http.get<IContactDetailResponse>(url)
  }

  submitContactContent(body: ContactFormBody) {
    const url = this.urlObject.buildUrl({ endpoint: 'qtndTtLienHeGui' })

    return this._http.post<IContactDetailResponse>(url, body)
  }
}
