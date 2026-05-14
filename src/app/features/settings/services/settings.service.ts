import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettingsState {
  readonly offlineReady: boolean;
  readonly readableChordLayout: boolean;
}

const SETTINGS_STORAGE_KEY = 'christsongs.settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly settingsSubject = new BehaviorSubject<AppSettingsState>(
    this.readInitialState(),
  );

  readonly settings$ = this.settingsSubject.asObservable();

  get snapshot(): AppSettingsState {
    return this.settingsSubject.value;
  }

  update(patch: Partial<AppSettingsState>): void {
    const nextState = { ...this.settingsSubject.value, ...patch };
    this.settingsSubject.next(nextState);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextState));
  }

  private readInitialState(): AppSettingsState {
    const fallbackState: AppSettingsState = {
      offlineReady: true,
      readableChordLayout: true,
    };

    const serializedState = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!serializedState) {
      return fallbackState;
    }

    try {
      const parsedState = JSON.parse(serializedState) as Partial<AppSettingsState>;

      return {
        offlineReady:
          typeof parsedState.offlineReady === 'boolean'
            ? parsedState.offlineReady
            : fallbackState.offlineReady,
        readableChordLayout:
          typeof parsedState.readableChordLayout === 'boolean'
            ? parsedState.readableChordLayout
            : fallbackState.readableChordLayout,
      };
    } catch {
      return fallbackState;
    }
  }
}