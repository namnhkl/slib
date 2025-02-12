import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

let requestCount = 0;
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  requestCount += 1;

  // loadingService.setLoading(true);
  return next(req).pipe(
    finalize(() => {
      requestCount -= 1;
      if (requestCount === 0) {
        // loadingService.setLoading(false);
      }
    }),
  );
};
