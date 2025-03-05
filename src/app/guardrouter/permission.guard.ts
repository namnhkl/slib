/* eslint-disable function-paren-newline */
import { CanActivateFn } from '@angular/router';

export const permissionGuard: CanActivateFn = (
  // route,
  // state
) => {
  // const token = localStorage.getItem('access_token');
  // const injector = InjectorService.getInjector();
  // const toastService = injector.get(ToastService);
  // if (!token) {
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('expires_in');
  //   localStorage.removeItem('username');
  //   window.location.href = `/${URL_ROUTER.dangNhap}`;
  //   return false; // Ngăn chặn truy cập vào route
  // }
  // const decodeToken: Record<string, any> = jwtDecode(token);
  // if (decodeToken[KeyPermissionRoot] !== 'root') {
  //   const router = new Router();
  //   toastService.showError(
  //     'Bạn không có quyền truy cập vào đường dẫn này vui lòng liên hệ quản trị hệ thống!'
  //   );
  //   router.navigate([`/${URL_ROUTER.trangChu}`]);
  //   return false; // Ngăn chặn truy cập vào route
  // }
  return true; // Cho phép truy cập vào route nếu có token
};
