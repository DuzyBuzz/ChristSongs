export const routeSegments = {
  splash: 'splash',
  auth: 'auth',
  signIn: 'sign-in',
  app: 'app',
  home: 'home',
  search: 'search',
  tuner: 'tuner',
  upload: 'upload',
  myUploads: 'my',
  edit: 'edit',
  library: 'library',
  offline: 'offline',
  profile: 'profile',
  settings: 'settings',
  songs: 'songs',
} as const;

export const appRoutes = {
  splash: `/${routeSegments.splash}`,
  signIn: `/${routeSegments.auth}/${routeSegments.signIn}`,
  home: `/${routeSegments.app}/${routeSegments.home}`,
  search: `/${routeSegments.app}/${routeSegments.search}`,
  tuner: `/${routeSegments.app}/${routeSegments.tuner}`,
  createSong: `/${routeSegments.app}/${routeSegments.upload}`,
  myUploads: `/${routeSegments.app}/${routeSegments.upload}/${routeSegments.myUploads}`,
  editSong: (songId: string): string =>
    `/${routeSegments.app}/${routeSegments.upload}/${songId}/${routeSegments.edit}`,
  favorites: `/${routeSegments.app}/${routeSegments.library}`,
  offlineSongs: `/${routeSegments.app}/${routeSegments.library}/${routeSegments.offline}`,
  profile: `/${routeSegments.app}/${routeSegments.profile}`,
  settings: `/${routeSegments.app}/${routeSegments.profile}/${routeSegments.settings}`,
  songDetail: (songId: string): string =>
    `/${routeSegments.app}/${routeSegments.songs}/${songId}`,
} as const;

export type ProtectedActionReason =
  | 'upload-song'
  | 'manage-uploads'
  | 'edit-song'
  | 'favorite-song'
  | 'offline-song'
  | 'profile'
  | 'library';