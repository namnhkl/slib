import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TYPE_MES } from '../constants/const';
import { _StoppableInjector, Stoppable } from '@/app/shared/@decorator/stoppable.decorator';

@Injectable({
  providedIn: 'root',
})
@Stoppable()
export class CommonService extends _StoppableInjector {
  private commonSubject = new BehaviorSubject<any>(null);

  getCommonObservable(): Observable<any> {
    return this.commonSubject.asObservable();
  }

  convertModelToParams(model: any) {
    const params = new URLSearchParams();
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        params.append(key, model[key]);
      }
    }
    return params.toString();
  }

  getStausByCode(code: number) {
    if (code === 200 || code === 201 || code === 204) return TYPE_MES.success;
    return TYPE_MES.error;
  }

  checkStausByCode(code: number) {
    if (code === 200 || code === 201 || code === 204) return true;
    return false;
  }
}
