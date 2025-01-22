import { Injectable } from '@angular/core';
import { TYPE_MES } from '../constants/const';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
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
