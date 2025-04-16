// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { map, take, tap } from 'rxjs/operators';
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

      // Nếu chưa đăng nhập, chuyển hướng đến trang login
      // Lưu URL hiện tại để có thể quay lại sau khi đăng nhập
      router.navigate(['/auth/login']);
      return false;
    })
  )
};
