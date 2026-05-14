import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { filter, firstValueFrom, take } from 'rxjs';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { christSongsBranding } from '../../../../core/config/branding.constants';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-splash-page',
  standalone: true,
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  imports: [IonContent, IonSpinner],
})
export class SplashPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly branding = christSongsBranding;

  constructor() {
    void this.routeUser();
  }

  private async routeUser(): Promise<void> {
    await firstValueFrom(
      this.authService.session$.pipe(
        filter((state) => state.isReady),
        take(1),
      ),
    );

    await this.router.navigateByUrl(appRoutes.home, { replaceUrl: true });
  }
}