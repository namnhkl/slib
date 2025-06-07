import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { icons } from './icons-provider';
import { routes } from './routes/app.routes';
import { configResponseInterceptor } from './http-interceptor/configResponse.interceptor';
import { configRequestInterceptor } from './http-interceptor/configRequest.interceptor';
import { loadingInterceptor } from './http-interceptor/loading.interceptor';


registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      TranslateModule.forRoot(),
      FormsModule
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        configRequestInterceptor,
        loadingInterceptor,
        configResponseInterceptor,
      ]),
    ),
    DatePipe,
  ],
};
