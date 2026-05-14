import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IonContent, IonItem, IonLabel, IonList, IonToggle } from '@ionic/angular/standalone';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [IonContent, IonList, IonItem, IonLabel, IonToggle, AppHeaderComponent],
})
export class SettingsPage {
  private readonly settingsService = inject(SettingsService);

  protected readonly appRoutes = appRoutes;
  protected readonly settings = toSignal(this.settingsService.settings$, {
    initialValue: this.settingsService.snapshot,
  });

  protected updateSetting(
    key: 'offlineReady' | 'readableChordLayout',
    event: Event,
  ): void {
    const toggleEvent = event as CustomEvent<{ checked: boolean }>;
    this.settingsService.update({ [key]: toggleEvent.detail.checked });
  }
}