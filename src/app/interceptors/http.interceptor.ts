import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Clone the request to add custom headers
		const authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer YOUR_AUTH_TOKEN`,
			},
		});
		// Handle the request and add error handling
		return next.handle(authReq).pipe(
			catchError((error: HttpErrorResponse) => {
				console.error('Error occurred:', error);

				// Handle specific status codes (e.g., 401 Unauthorized)
				if (error.status === 401) {
					console.error('Unauthorized! Redirecting to login...');
					// Add your redirection logic here
				}

				// Return an observable with an error message
				return throwError(() => new Error(error.message || 'Unknown Error'));
			}),
		);
	}
}
