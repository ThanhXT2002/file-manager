import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // Nếu đã đăng nhập, cho phép truy cập route
      if (user) {
        return true;
      }

      // Lưu URL hiện tại để có thể quay lại sau khi đăng nhập
      const returnUrl = state.url;
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl }
      });
      return false;
    })
  );
};
