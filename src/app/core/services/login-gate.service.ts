import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import {
  appRoutes,
  ProtectedActionReason,
} from '../config/route-paths.constants';
import { AuthService } from './auth.service';

const PENDING_ACTION_STORAGE_KEY = 'christsongs.pending-action';

export interface ProtectedActionPrompt {
  readonly heading: string;
  readonly description: string;
}

export interface PendingProtectedAction {
  readonly continueTo: string;
  readonly reason: ProtectedActionReason;
  readonly payload: Record<string, string>;
}

@Injectable({
  providedIn: 'root',
})
export class LoginGateService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  buildSignInUrl(
    continueTo: string,
    reason: ProtectedActionReason,
  ): UrlTree {
    return this.router.createUrlTree([appRoutes.signIn], {
      queryParams: {
        continueTo,
        reason,
      },
    });
  }

  async requireAuthentication(options: {
    readonly continueTo: string;
    readonly reason: ProtectedActionReason;
    readonly payload?: Record<string, string>;
  }): Promise<boolean> {
    if (this.authService.snapshot.isAuthenticated) {
      return true;
    }

    this.storePendingAction({
      continueTo: options.continueTo,
      reason: options.reason,
      payload: options.payload ?? {},
    });

    await this.router.navigateByUrl(
      this.buildSignInUrl(options.continueTo, options.reason),
    );

    return false;
  }

  getPrompt(reason: ProtectedActionReason | null): ProtectedActionPrompt {
    switch (reason) {
      case 'upload-song':
        return {
          heading: 'Sign in to upload songs',
          description:
            'Google sign-in is only required when you want to publish a song or arrangement.',
        };
      case 'manage-uploads':
        return {
          heading: 'Sign in to manage your uploads',
          description:
            'Your uploaded songs are tied to your account so only you can edit or delete them.',
        };
      case 'edit-song':
        return {
          heading: 'Sign in to edit this song',
          description:
            'Edits are protected by ownership rules, so we need your account before continuing.',
        };
      case 'favorite-song':
        return {
          heading: 'Sign in to save favorites',
          description:
            'Favorites sync to your private Firestore library, so this action needs your account.',
        };
      case 'offline-song':
        return {
          heading: 'Sign in to sync offline songs',
          description:
            'Offline saves can sync to your account so you can restore them later on another device.',
        };
      case 'profile':
        return {
          heading: 'Sign in to view your profile',
          description:
            'Your profile, uploads, and personal counters are only available after sign-in.',
        };
      case 'library':
        return {
          heading: 'Sign in to open your library',
          description:
            'Favorites and offline sync belong to your personal account and are not public.',
        };
      default:
        return {
          heading: 'Sign in to continue',
          description:
            'Browsing stays open to guests, but this action needs your Google account.',
        };
    }
  }

  reconcilePendingAction(
    continueTo: string,
    reason: ProtectedActionReason | null,
  ): void {
    const pendingAction = this.peekPendingAction();

    if (
      pendingAction
      && (pendingAction.continueTo !== continueTo || pendingAction.reason !== reason)
    ) {
      this.clearPendingAction();
    }
  }

  consumePendingAction(expectedUrl: string): PendingProtectedAction | null {
    const pendingAction = this.peekPendingAction();

    if (!pendingAction || pendingAction.continueTo !== expectedUrl) {
      return null;
    }

    sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);
    return pendingAction;
  }

  clearPendingAction(): void {
    sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);
  }

  private peekPendingAction(): PendingProtectedAction | null {
    const serializedAction = sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY);

    if (!serializedAction) {
      return null;
    }

    try {
      const parsedAction = JSON.parse(serializedAction) as PendingProtectedAction;

      return parsedAction.continueTo && parsedAction.reason
        ? parsedAction
        : null;
    } catch {
      this.clearPendingAction();
      return null;
    }
  }

  private storePendingAction(action: PendingProtectedAction): void {
    sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, JSON.stringify(action));
  }
}