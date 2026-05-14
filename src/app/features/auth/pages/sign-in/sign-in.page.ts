import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { filter } from 'rxjs';

import {
  appRoutes,
  ProtectedActionReason,
} from '../../../../core/config/route-paths.constants';
import { christSongsBranding } from '../../../../core/config/branding.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { LoginGateService } from '../../../../core/services/login-gate.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  imports: [IonContent, IonButton, IonSpinner],
})
export class SignInPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loginGateService = inject(LoginGateService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly appRoutes = appRoutes;
  protected readonly branding = christSongsBranding;
  protected isSubmitting = false;
  protected readonly continueTo =
    this.activatedRoute.snapshot.queryParamMap.get('continueTo') ?? appRoutes.home;
  protected readonly reason =
    (this.activatedRoute.snapshot.queryParamMap.get('reason') as ProtectedActionReason | null) ??
    null;
  protected readonly prompt = this.loginGateService.getPrompt(this.reason);

  constructor() {
    this.loginGateService.reconcilePendingAction(this.continueTo, this.reason);

    this.authService.session$
      .pipe(
        filter((session) => session.isReady && session.isAuthenticated),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        void this.router.navigateByUrl(this.continueTo, { replaceUrl: true });
      });
  }

  protected async continueAsGuest(): Promise<void> {
    this.loginGateService.clearPendingAction();
    await this.router.navigateByUrl(appRoutes.home, { replaceUrl: true });
  }

  protected async signIn(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      await this.toastService.showError(mapFirebaseError(error));
    } finally {
      this.isSubmitting = false;
    }
  }
}