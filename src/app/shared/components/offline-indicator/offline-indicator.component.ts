import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { NetworkService } from '../../../core/services/network.service';

@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  templateUrl: './offline-indicator.component.html',
  styleUrls: ['./offline-indicator.component.scss'],
})
export class OfflineIndicatorComponent {
  private readonly networkService = inject(NetworkService);

  protected readonly isOnline = toSignal(this.networkService.isOnline$, {
    initialValue: navigator.onLine,
  });
}