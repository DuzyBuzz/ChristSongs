import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { appRoutes } from '../config/route-paths.constants';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.session$.pipe(
    filter((session) => session.isReady),
    take(1),
    map((session) =>
      session.isAuthenticated ? true : router.parseUrl(appRoutes.signIn),
    ),
  );
};