import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError, catchError, switchMap, filter, take } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Private subject để tránh vòng lặp refresh token
  const refreshTokenInProgress = new BehaviorSubject<boolean>(false);

  // Chỉ thêm withCredentials nếu chưa được thiết lập
  if (!req.withCredentials) {
    req = req.clone({
      withCredentials: true,
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Tránh refresh token cho chính request /refresh
        if (req.url.includes('/auth/refresh')) {
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        // Xử lý refresh token
        return handleRefreshToken(req, next, error, authService, router, refreshTokenInProgress);
      }
      return throwError(() => error);
    })
  );
};

function handleRefreshToken(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  error: HttpErrorResponse,
  authService: AuthService,
  router: Router,
  refreshTokenInProgress: BehaviorSubject<boolean>
) {
  // Nếu chưa đang refresh token
  if (!refreshTokenInProgress.value) {
    refreshTokenInProgress.next(true);

    return authService.refreshToken().pipe(
      switchMap(() => {
        refreshTokenInProgress.next(false);

        // Thử lại request ban đầu sau khi refresh token thành công
        return next(req);
      }),
      catchError((refreshError) => {
        refreshTokenInProgress.next(false);

        // Nếu refresh token thất bại, chuyển đến trang login
        if (!router.url.includes('/auth/login')) {
          router.navigate(['/auth/login']);
        }

        return throwError(() => refreshError);
      })
    );
  } else {
    // Nếu đang trong quá trình refresh token, đợi hoàn tất rồi thử lại
    return refreshTokenInProgress.pipe(
      filter(inProgress => !inProgress),
      take(1),
      switchMap(() => next(req))
    );
  }
}
