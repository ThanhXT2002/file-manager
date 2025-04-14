import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

import { map, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (
  route,
  state
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map((user) => {
      // Check if user exists and has admin role
      if (user && user.role === 1) {
        return true;
      }
      // Redirect to forbidden page
      return router.createUrlTree(['/forbidden']);
    })
  );
};
