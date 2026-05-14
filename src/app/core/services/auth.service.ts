import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { AuthSession, INITIAL_AUTH_SESSION } from '../../features/auth/models/auth-session.model';
import { GoogleAuthAdapterService } from '../../features/auth/services/google-auth-adapter.service';
import { mapFirebaseError } from '../firebase/firebase-error.mapper';
import { FIREBASE_AUTH } from '../firebase/firebase.providers';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly firebaseAuth = inject(FIREBASE_AUTH);
  private readonly googleAuthAdapter = inject(GoogleAuthAdapterService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly sessionSubject = new BehaviorSubject<AuthSession>(INITIAL_AUTH_SESSION);

  readonly session$: Observable<AuthSession> = this.sessionSubject.asObservable();

  get snapshot(): AuthSession {
    return this.sessionSubject.value;
  }

  constructor() {
    void this.initialize();
  }

  async signInWithGoogle(): Promise<void> {
    const credential = await this.googleAuthAdapter.signIn(this.firebaseAuth);

    if (credential?.user) {
      await this.syncSignedInUser(credential.user);
    }
  }

  async signOut(): Promise<void> {
    await this.googleAuthAdapter.signOut();
    await signOut(this.firebaseAuth);
    this.sessionSubject.next({ ...INITIAL_AUTH_SESSION, isReady: true });
  }

  private async initialize(): Promise<void> {
    try {
      const redirectCredential = await this.googleAuthAdapter.consumeRedirectResult(
        this.firebaseAuth,
      );

      if (redirectCredential?.user) {
        await this.syncSignedInUser(redirectCredential.user);
      }
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/argument-error') {
        // This can happen when no redirect auth flow is active in the current session.
      } else {
        console.error(mapFirebaseError(error));
      }
    }

    onAuthStateChanged(this.firebaseAuth, (firebaseUser) => {
      void this.handleAuthStateChange(firebaseUser);
    });
  }

  private async handleAuthStateChange(firebaseUser: User | null): Promise<void> {
    if (!firebaseUser) {
      this.sessionSubject.next({ ...INITIAL_AUTH_SESSION, isReady: true });
      return;
    }

    await this.syncSignedInUser(firebaseUser);
  }

  private async syncSignedInUser(firebaseUser: User): Promise<void> {
    await this.userProfileService.upsertUserProfile(firebaseUser);
    const profile = await this.userProfileService.getProfile(firebaseUser.uid);

    this.sessionSubject.next({
      isAuthenticated: true,
      isReady: true,
      firebaseUser,
      user: profile,
    });
  }
}