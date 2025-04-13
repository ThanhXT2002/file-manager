import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { definePreset } from '@primeng/themes';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeng/themes/nora';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MyPreset } from './core/theme/my-preset';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';


// Factory function cho TranslateLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './languages/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: 'vi',
        isolate: false,
      })
    ),
    MessageService,
  ],
};


