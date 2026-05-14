import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { christSongsBranding } from '../../../../core/config/branding.constants';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { ProfileService, ProfileSummary } from '../../services/profile.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    IonContent,
    IonButton,
    RouterLink,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
})
export class ProfilePage {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly appRoutes = appRoutes;
  protected readonly branding = christSongsBranding;
  protected isGuest = true;
  protected summary: ProfileSummary | null = null;
  protected isLoading = true;
  protected errorMessage = '';

  constructor() {
    void this.loadProfile();
  }

  protected reload(): void {
    void this.loadProfile();
  }

  protected async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      await this.router.navigateByUrl(appRoutes.home, { replaceUrl: true });
    } catch (error) {
      await this.toastService.showError(mapFirebaseError(error));
    }
  }

  private async loadProfile(): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!currentUserId) {
      this.isGuest = true;
      this.summary = null;
      this.isLoading = false;
      return;
    }

    this.isGuest = false;
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.summary = await this.profileService.getProfileSummary(currentUserId);
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}