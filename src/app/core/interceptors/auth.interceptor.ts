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

  // Đảm bảo gửi cookies với mọi request
  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Xử lý lỗi 401 Unauthorized
      if (error.status === 401) {
        // Điều hướng đến trang đăng nhập
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
