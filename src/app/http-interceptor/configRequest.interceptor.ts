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
    const cleanedToken = token.replace(/^"|"$/g, '');
    headers = headers.set('Authorization', `Bearer ${cleanedToken}`);
  }

  if (thuvienId) {
    headers = headers.set('X-BsThuvienId', thuvienId);
  }

  let modifiedReq = req;

  if (req.method === 'GET') {
    try {
      // Kiểm tra nếu là URL tuyệt đối hay tương đối
      const isAbsoluteUrl = /^https?:\/\//.test(req.url);
      const baseUrl = isAbsoluteUrl ? '' : window.location.origin;
      const url = new URL(req.url, baseUrl);

      const params = url.searchParams;
      const currentSecret = params.get('secretkey');

      if (!currentSecret) {
        params.set('secretkey', secretkey);
      }

      const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
      modifiedReq = req.clone({ headers, url: newUrl });
    } catch (error) {
      // Nếu có lỗi khi phân tích URL, giữ nguyên URL gốc
      modifiedReq = req.clone({ headers });
    }
  } else {
    modifiedReq = req.clone({ headers });
  }

  return next(modifiedReq);
};
