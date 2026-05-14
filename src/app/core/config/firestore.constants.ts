export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  songs: 'songs',
  arrangements: 'arrangements',
  favorites: 'favorites',
  offlineSongs: 'offlineSongs',
  reports: 'reports',
} as const;

export const SONG_STATUS = {
  active: 'active',
  draft: 'draft',
} as const;

export type SongStatus =
  (typeof SONG_STATUS)[keyof typeof SONG_STATUS];