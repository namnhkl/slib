// import { HttpInterceptorFn } from '@angular/common/http';
// import _ from 'lodash';

// export const configRequestInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

//   if (token) {
//     const cleanedToken = token.replace(/^"|"$/g, ''); // loại bỏ dấu " nếu có
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${cleanedToken}`),
//       responseType: _.get(req, 'responseType', 'json'),
//     });

//     return next(authReq);
//   }

//   return next(req);
// };

import { HttpInterceptorFn } from '@angular/common/http';
import _ from 'lodash';

export const configRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const thuvienId = localStorage.getItem('bs_thuvien_id') || ''; // lấy từ localStorage (hoặc có thể hardcode nếu cần)

  let headers = req.headers;

  if (token) {
    const cleanedToken = token.replace(/^"|"$/g, '');
    headers = headers.set('Authorization', `Bearer ${cleanedToken}`);
  }

 if (thuvienId) {
  headers = headers.set('X-BsThuvienId', thuvienId);
}

  const authReq = req.clone({
    headers,
    responseType: _.get(req, 'responseType', 'json'),
  });

  return next(authReq);
};

