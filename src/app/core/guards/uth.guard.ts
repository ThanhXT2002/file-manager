// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { map, tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map((user) => !!user),
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
      }
    })
  );
};
