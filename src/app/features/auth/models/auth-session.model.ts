import { User } from 'firebase/auth';

import { AppUser } from '../../../models/app-user.model';

export interface AuthSession {
  readonly isAuthenticated: boolean;
  readonly isReady: boolean;
  readonly firebaseUser: User | null;
  readonly user: AppUser | null;
}

export const INITIAL_AUTH_SESSION: AuthSession = {
  isAuthenticated: false,
  isReady: false,
  firebaseUser: null,
  user: null,
};