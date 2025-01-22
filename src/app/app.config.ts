import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ROUTES } from './app.routes';
import { GlobalErrorHandlerService } from './shared/services';
import { HttpClient } from '@angular/common/http';
import { HttpInterceptorService } from './interceptors/http.interceptor';

// Factory function for the loader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

//** Angular Animations: https://angular.dev/guide/animations/route-animations */
export const appConfig: ApplicationConfig = {
	providers: [
		importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
		provideZoneChangeDetection({ eventCoalescing: true }),
		{ provide: ErrorHandler, useClass: GlobalErrorHandlerService },
		provideRouter(ROUTES, withViewTransitions()),
    provideAnimationsAsync(),
		provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true, // Ensure multiple interceptors can be used
    }
	],
};
