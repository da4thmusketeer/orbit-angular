import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // If not currently logged in in memory/storage, attempt refresh
  return authService.refresh().pipe(
    map(() => {
      if (authService.isLoggedIn()) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
