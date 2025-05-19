// non-auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';


export const nonAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      // Nếu đã đăng nhập, chuyển hướng về trang chủ
      if (user) {
        router.navigate(['/manager-file/my-files']);
        return false;
      }

      // Nếu chưa đăng nhập, cho phép truy cập
      return true;
    })
  );
};
