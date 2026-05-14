import { appRoutes } from './route-paths.constants';

export interface AppTabDefinition {
  readonly label: string;
  readonly tab: 'home' | 'search' | 'upload' | 'library' | 'profile';
  readonly href: string;
  readonly icon: 'home' | 'search' | 'add-circle' | 'bookmarks' | 'person-circle';
}

export const APP_TABS: readonly AppTabDefinition[] = [
  {
    label: 'Home',
    tab: 'home',
    href: appRoutes.home,
    icon: 'home',
  },
  {
    label: 'Search',
    tab: 'search',
    href: appRoutes.search,
    icon: 'search',
  },
  {
    label: 'Upload',
    tab: 'upload',
    href: appRoutes.createSong,
    icon: 'add-circle',
  },
  {
    label: 'Library',
    tab: 'library',
    href: appRoutes.favorites,
    icon: 'bookmarks',
  },
  {
    label: 'Profile',
    tab: 'profile',
    href: appRoutes.profile,
    icon: 'person-circle',
  },
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const HOME_SECTION_SIZE = 8;
export const DEFAULT_INSTRUMENTS = [
  'guitar',
  'piano',
  'ukulele',
  'violin',
  'bass',
  'cajon',
  'mandolin',
] as const;