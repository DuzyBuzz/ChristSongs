import { Routes } from '@angular/router';

import { routeSegments } from './core/config/route-paths.constants';
import { guestGuard } from './core/guards/guest.guard';
import { signInRequiredGuard } from './core/guards/sign-in-required.guard';
import { songOwnerGuard } from './features/uploads/guards/song-owner.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: routeSegments.splash,
    pathMatch: 'full',
  },
  {
    path: routeSegments.splash,
    loadComponent: () =>
      import('./features/auth/pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: routeSegments.auth,
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./core/layout/auth-shell/auth-shell.component').then(
        (m) => m.AuthShellComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: routeSegments.signIn,
        pathMatch: 'full',
      },
      {
        path: routeSegments.signIn,
        loadComponent: () =>
          import('./features/auth/pages/sign-in/sign-in.page').then(
            (m) => m.SignInPage,
          ),
      },
    ],
  },
  {
    path: routeSegments.app,
    loadComponent: () =>
      import('./core/layout/app-shell/app-shell.component').then(
        (m) => m.AppShellComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: routeSegments.home,
        pathMatch: 'full',
      },
      {
        path: routeSegments.home,
        loadComponent: () =>
          import('./features/songs/pages/home/home.page').then(
            (m) => m.HomePage,
          ),
      },
      {
        path: routeSegments.search,
        loadComponent: () =>
          import('./features/search/pages/search/search.page').then(
            (m) => m.SearchPage,
          ),
      },
      {
        path: routeSegments.tuner,
        loadComponent: () =>
          import('./features/tuner/pages/tuner/tuner.page').then(
            (m) => m.TunerPage,
          ),
      },
      {
        path: routeSegments.upload,
        canActivate: [signInRequiredGuard],
        data: { reason: 'upload-song' },
        loadComponent: () =>
          import('./features/uploads/pages/create-song/create-song.page').then(
            (m) => m.CreateSongPage,
          ),
      },
      {
        path: `${routeSegments.upload}/${routeSegments.myUploads}`,
        canActivate: [signInRequiredGuard],
        data: { reason: 'manage-uploads' },
        loadComponent: () =>
          import('./features/uploads/pages/my-uploads/my-uploads.page').then(
            (m) => m.MyUploadsPage,
          ),
      },
      {
        path: `${routeSegments.upload}/:songId/${routeSegments.edit}`,
        canActivate: [signInRequiredGuard, songOwnerGuard],
        data: { reason: 'edit-song' },
        loadComponent: () =>
          import('./features/uploads/pages/edit-song/edit-song.page').then(
            (m) => m.EditSongPage,
          ),
      },
      {
        path: routeSegments.library,
        loadComponent: () =>
          import('./features/library/pages/favorites/favorites.page').then(
            (m) => m.FavoritesPage,
          ),
      },
      {
        path: `${routeSegments.library}/${routeSegments.offline}`,
        loadComponent: () =>
          import('./features/library/pages/offline-songs/offline-songs.page').then(
            (m) => m.OfflineSongsPage,
          ),
      },
      {
        path: routeSegments.profile,
        loadComponent: () =>
          import('./features/profile/pages/profile/profile.page').then(
            (m) => m.ProfilePage,
          ),
      },
      {
        path: `${routeSegments.profile}/${routeSegments.settings}`,
        loadComponent: () =>
          import('./features/settings/pages/settings/settings.page').then(
            (m) => m.SettingsPage,
          ),
      },
      {
        path: `${routeSegments.songs}/:songId`,
        loadComponent: () =>
          import('./features/songs/pages/song-detail/song-detail.page').then(
            (m) => m.SongDetailPage,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: routeSegments.splash,
  },
];
