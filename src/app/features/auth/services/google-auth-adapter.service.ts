import { Injectable } from '@angular/core';
import {
  Auth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  UserCredential,
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthAdapterService {
  async signIn(auth: Auth): Promise<UserCredential | null> {
    const provider = this.buildProvider();

    if (Capacitor.isNativePlatform()) {
      await signInWithRedirect(auth, provider);
      return null;
    }

    return signInWithPopup(auth, provider);
  }

  async consumeRedirectResult(auth: Auth): Promise<UserCredential | null> {
    return getRedirectResult(auth);
  }

  async signOut(): Promise<void> {
    return Promise.resolve();
  }

  private buildProvider(): GoogleAuthProvider {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
  }
}