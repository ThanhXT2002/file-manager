// src/app/interceptors/auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);

  // Chỉ thêm withCredentials nếu chưa được thiết lập
  if (!req.withCredentials) {
    req = req.clone({
      withCredentials: true,
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Kiểm tra xem đã ở trang login chưa
        if (!router.url.includes('/auth/login')) {
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
