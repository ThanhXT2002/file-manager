import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  throwError,
  catchError,
  switchMap,
  filter,
  take,
  of,
} from 'rxjs';
import { AuthService } from '../service/auth.service';

// Biến toàn cục để tránh tạo nhiều BehaviorSubject
const refreshTokenInProgress = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthRequest = req.url.includes('/auth/');
  const isAuthCheckRequest = req.url.includes('/auth/me');
  const isRefreshRequest = req.url.includes('/auth/refresh');

  // Chỉ thêm withCredentials nếu chưa được thiết lập
  if (!req.withCredentials) {
    req = req.clone({
      withCredentials: true,
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Xử lý lỗi kết nối mạng đặc biệt
      if (error.status === 0) {
        console.warn('Network connection error:', req.url);

        // Đối với các API xác thực, không cần xử lý đặc biệt
        if (isAuthCheckRequest || isRefreshRequest) {
          return throwError(() => error);
        }
      }

      // Chỉ xử lý lỗi 401 nếu không phải là request kiểm tra auth và người dùng đã đăng nhập
      if (
        error.status === 401 &&
        !isAuthCheckRequest &&
        !isRefreshRequest &&
        authService.isLoggedIn
      ) {
        return handleRefreshToken(
          req,
          next,
          authService,
          refreshTokenInProgress
        );
      }

      return throwError(() => error);
    })
  );
};

function handleRefreshToken(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  refreshTokenInProgress: BehaviorSubject<boolean>
) {
  // Nếu chưa đang refresh token
  if (!refreshTokenInProgress.value) {
    refreshTokenInProgress.next(true);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        refreshTokenInProgress.next(false);

        // Nếu refresh token thành công, thử lại request ban đầu
        if (response && response.success) {
          return next(req);
        }

        // Nếu không thành công, hủy request
        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError((refreshError) => {
        refreshTokenInProgress.next(false);

        // Nếu là lỗi mạng, giữ nguyên trạng thái
        if (refreshError.status === 0) {
          console.warn('Network error during token refresh, keeping current state');
          return throwError(() => refreshError);
        }

        return throwError(() => refreshError);
      })
    );
  } else {
    // Nếu đang trong quá trình refresh token, đợi hoàn tất rồi thử lại
    return refreshTokenInProgress.pipe(
      filter((inProgress) => !inProgress),
      take(1),
      switchMap(() => {
        // Kiểm tra trạng thái đăng nhập sau khi refresh token hoàn tất
        if (authService.isLoggedIn) {
          return next(req);
        }
        return throwError(
          () => new Error('User not logged in after token refresh')
        );
      })
    );
  }
}
