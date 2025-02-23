import { CanActivateFn } from '@angular/router';
import { URL_ROUTER } from '../shared/constants/path.constants';

export const authGuard: CanActivateFn = () =>
  // route, state
  {
    const token = localStorage.getItem('access_token');
    const expiresIn = localStorage.getItem('expires_in');
    if (!token || !expiresIn || new Date() > new Date(expiresIn)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('username');
      window.location.href = `/${URL_ROUTER.login}`;

      return false; // Ngăn chặn truy cập vào route
    }

    return true; // Cho phép truy cập vào route nếu có token
  };
