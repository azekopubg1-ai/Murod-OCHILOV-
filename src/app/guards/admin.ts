import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to be ready
  return toObservable(auth.isAuthReady).pipe(
    filter(ready => ready === true),
    take(1),
    map(() => {
      if (auth.isAdmin()) {
        return true;
      }
      
      // If not admin, redirect to home
      router.navigate(['/']);
      return false;
    })
  );
};
