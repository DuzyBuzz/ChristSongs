import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { appRoutes } from '../../../core/config/route-paths.constants';
import { AuthService } from '../../../core/services/auth.service';
import { SongQueryService } from '../../songs/services/song-query.service';

export const songOwnerGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const songQueryService = inject(SongQueryService);
  const songId = route.paramMap.get('songId');

  if (!authService.snapshot.isAuthenticated) {
    return router.parseUrl(appRoutes.signIn);
  }

  if (!songId) {
    return router.parseUrl(appRoutes.myUploads);
  }

  const song = await songQueryService.getSongById(songId);

  return song?.uploaderUid === authService.snapshot.firebaseUser?.uid
    ? true
    : router.parseUrl(appRoutes.myUploads);
};