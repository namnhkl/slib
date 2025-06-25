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

// import { HttpInterceptorFn } from '@angular/common/http';
// import _ from 'lodash';

// export const configRequestInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
//   const thuvienId = localStorage.getItem('bs_thuvien_id') || ''; // lấy từ localStorage (hoặc có thể hardcode nếu cần)

//   let headers = req.headers;

//   if (token) {
//     const cleanedToken = token.replace(/^"|"$/g, '');
//     headers = headers.set('Authorization', `Bearer ${cleanedToken}`);
//   }

//  if (thuvienId) {
//   headers = headers.set('X-BsThuvienId', thuvienId);
// }

//   const authReq = req.clone({
//     headers,
//     responseType: _.get(req, 'responseType', 'json'),
//   });

//   return next(authReq);
// };


import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'environments/environment';

export const configRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const thuvienId = localStorage.getItem('bs_thuvien_id') || '';
const secretkey = environment.SECRETKEY;

let headers = req.headers;

if (token) {
  headers = headers.set('Authorization', `Bearer ${token.replace(/^"|"$/g, '')}`);
}
if (thuvienId) {
  headers = headers.set('X-BsThuvienId', thuvienId);
}

let modifiedReq = req;

if (req.method === 'GET') {
  try {
    const url = new URL(req.url, window.location.origin);
    if (secretkey && !url.searchParams.has('secretkey')) {
      url.searchParams.set('secretkey', secretkey);
    }

    modifiedReq = req.clone({
      headers,
      url: url.toString()
    });
  } catch {
    modifiedReq = req.clone({ headers });
  }
} else {
  modifiedReq = req.clone({ headers });
}

return next(modifiedReq);

};
