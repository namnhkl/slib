import { HttpInterceptorFn } from '@angular/common/http';
import _ from 'lodash';

export const configRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  if (token) {
    const cleanedToken = token.replace(/^"|"$/g, ''); // loại bỏ dấu " nếu có
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${cleanedToken}`),
      responseType: _.get(req, 'responseType', 'json'),
    });

    return next(authReq);
  }

  return next(req);
};
