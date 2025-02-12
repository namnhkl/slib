/* eslint-disable function-paren-newline */
import { CanActivateFn } from '@angular/router';

export const loginGuard: CanActivateFn = (
  // route, state
) => {
  // const token = localStorage.getItem('access_token');
  // const expiresIn = localStorage.getItem('expires_in') || new Date();
  // if (!token || new Date() > new Date(expiresIn)) {
  return true;
  // }
  // const router = new Router();
  // router.navigate(['/']);
  // return false;
};
