import { Component, input } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { christSongsBranding } from '../../../core/config/branding.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
  ],
})
export class AppHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly showBackButton = input(false);
  readonly defaultHref = input<string>('');
  protected readonly brandLogoUrl = christSongsBranding.assets.logo.fishMark;
  protected readonly brandLogoAlt = `${christSongsBranding.appName} logo`;
}