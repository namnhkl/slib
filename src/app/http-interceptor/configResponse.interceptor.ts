import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { InjectorService } from '../shared/services/injector.service';
import { URL_ROUTER } from '../shared/constants/path.constants';
import { AppHttpError } from '../shared/models/http';
import { TranslateService } from '@ngx-translate/core';

const defaultErrorMessage = 'Đã có lỗi xảy ra! Vui lòng thực hiện lại';
function handle400BadRequest(error: AppHttpError, notificationService: NzNotificationService) {
  const handleComposeErrMsg = (errorInput: any) : string => {
    if (!errorInput || !errorInput.errors) return defaultErrorMessage;

    if (errorInput.errors.command) {
      return errorInput.errors.command.join('\n');
    } if (errorInput.errors) {
      return errorInput.errors.map((x: any) => x.message).join(', ');
    } return defaultErrorMessage;
  };

  notificationService.create(
    'error',
    'Lỗi',
    handleComposeErrMsg(error.error),
  );

  return throwError(new Error(error.error as any));
}

function handle401(error: AppHttpError, router: Router, notification: NzNotificationService, translate: TranslateService) {
  localStorage.removeItem('access_token');
  notification.warning(translate.instant('login_het_phien_dang_nhap'), translate.instant('login_vui_long_dang_nhap_lai'));
  router.navigateByUrl(URL_ROUTER.home);
  return throwError(() => new Error(error.error as any));
}

// function handle401Unthorized(error: AppHttpError, route: Router) {
//   localStorage.removeItem('access_token');
//   route.navigateByUrl(URL_ROUTER.login);
//   return throwError(new Error(error.error as any));
// }

function handle403Forbiden(error: AppHttpError) {
  // route.navigateByUrl(URL_ROUTER.notFound);
  return throwError(new Error(error.error as any));
}

function handle404Notfound(error: AppHttpError) {
  // route.navigateByUrl(URL_ROUTER.notFound);
  return throwError(new Error(error.error as any));
}

export const configResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = InjectorService.getInjector();
  const notificationService = injector.get(NzNotificationService);
  const translateService = injector.get(TranslateService);
  const route = injector.get(Router);

  return next(req).pipe(
    catchError((error: AppHttpError) => {
      if (error.status === 401) {
        return handle401(error, route, notificationService, translateService);
      }
      if (error.status === 400) {
        return handle400BadRequest(error, notificationService);
      }
      if (error.status === 403) {
        return handle403Forbiden(error);
      }
      if (error.status === 404) {
        return handle404Notfound(error);
      }

      return throwError(new Error(error.error as any));
    }),
  );
};
