import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class ExternalLinkService {
  async open(url: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
      return;
    }

    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    if (!newWindow) {
      throw new Error('Could not open the link.');
    }

    newWindow.opener = null;
  }
}