import { HttpInterceptorFn } from '@angular/common/http';
import _ from 'lodash';

export const configRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      responseType: _.get(req, 'responseType', 'json'),
    });

    return next(authReq);
  }

  return next(req);
};
