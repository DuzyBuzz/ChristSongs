import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { ProtectedActionReason } from '../config/route-paths.constants';
import { AuthService } from '../services/auth.service';
import { LoginGateService } from '../services/login-gate.service';

export const signInRequiredGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const loginGateService = inject(LoginGateService);
  const reason =
    (route.data['reason'] as ProtectedActionReason | undefined) ?? 'upload-song';

  return authService.session$.pipe(
    filter((session) => session.isReady),
    take(1),
    map((session) =>
      session.isAuthenticated
        ? true
        : loginGateService.buildSignInUrl(state.url, reason),
    ),
  );
};