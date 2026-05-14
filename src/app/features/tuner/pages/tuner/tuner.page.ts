import { Component, computed, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { DEFAULT_TUNER_PRESET, TUNER_INSTRUMENTS, TUNER_PRESETS } from '../../data/tuner-presets.data';
import { AUTO_TUNER_STRING_ID, TunerState, TunerStringTarget } from '../../models/tuner.model';
import { TunerService } from '../../services/tuner.service';
import { clampNumber } from '../../utilities/tuning-note.util';

@Component({
  selector: 'app-tuner-page',
  standalone: true,
  templateUrl: './tuner.page.html',
  styleUrls: ['./tuner.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    RouterLink,
    AppHeaderComponent,
  ],
})
export class TunerPage implements OnDestroy {
  private readonly tunerService = inject(TunerService);

  protected readonly appRoutes = appRoutes;
  protected readonly autoStringId = AUTO_TUNER_STRING_ID;
  protected readonly instruments = TUNER_INSTRUMENTS;
  protected readonly tunerState = this.tunerService.state;
  protected readonly availablePresets = computed(() =>
    TUNER_PRESETS.filter(
      (preset) => preset.instrumentId === this.tunerState().preset.instrumentId,
    ),
  );
  protected readonly displayedTarget = computed(() => {
    const state = this.tunerState();

    if (state.targetString) {
      return state.targetString;
    }

    if (state.selectedStringId === AUTO_TUNER_STRING_ID) {
      return null;
    }

    return state.preset.strings.find((candidate) => candidate.id === state.selectedStringId) ?? null;
  });
  protected readonly primaryButtonLabel = computed(() => {
    const status = this.tunerState().status;

    if (status === 'requesting') {
      return 'Starting...';
    }

    return status === 'listening' ? 'Stop tuner' : 'Start tuner';
  });
  protected readonly needlePosition = computed(() => {
    const centsOffset = clampNumber(this.tunerState().centsOffset ?? 0, -50, 50);
    return `${50 + centsOffset}%`;
  });
  protected readonly heardNoteLabel = computed(() => this.tunerState().detectedNote || '--');
  protected readonly frequencyLabel = computed(() => {
    const frequency = this.tunerState().detectedFrequency;
    return frequency === null ? '--' : `${frequency.toFixed(1)} Hz`;
  });
  protected readonly centsLabel = computed(() => {
    const centsOffset = this.tunerState().centsOffset;

    if (centsOffset === null) {
      return '--';
    }

    const rounded = Math.round(centsOffset);
    const prefix = rounded > 0 ? '+' : '';
    return `${prefix}${rounded} cents`;
  });
  protected readonly clarityLabel = computed(() => {
    const clarity = this.tunerState().clarity;
    return clarity > 0 ? `${Math.round(clarity * 100)}%` : '--';
  });
  protected readonly targetTitle = computed(() => {
    const target = this.displayedTarget();
    return target ? target.note : 'Auto';
  });
  protected readonly targetDescription = computed(() => {
    const target = this.displayedTarget();

    if (!target) {
      return 'Auto listens for the closest string in this tuning.';
    }

    return `${target.label} • ${this.tunerState().preset.instrumentLabel} ${this.tunerState().preset.name}`;
  });
  protected readonly hintText = computed(() => {
    const state = this.tunerState();

    if (state.direction === 'in-tune' && state.targetString) {
      return `${state.targetString.note} is right on pitch.`;
    }

    if (state.direction === 'flat') {
      return 'Tighten the string a little.';
    }

    if (state.direction === 'sharp') {
      return 'Loosen the string a little.';
    }

    return state.message;
  });
  protected readonly statusLabel = computed(() => this.buildStatusLabel(this.tunerState()));

  protected changeInstrument(instrumentId: string | number | undefined): void {
    const normalizedInstrumentId = typeof instrumentId === 'string' ? instrumentId : undefined;
    const preset = TUNER_PRESETS.find(
      (candidate) => candidate.instrumentId === normalizedInstrumentId,
    )
      ?? DEFAULT_TUNER_PRESET;

    this.tunerService.selectPreset(preset.id);
  }

  protected changePreset(presetId: string | number | undefined): void {
    const normalizedPresetId = typeof presetId === 'string' ? presetId : undefined;

    if (!normalizedPresetId) {
      return;
    }

    this.tunerService.selectPreset(normalizedPresetId);
  }

  protected changeString(stringId: string | number | undefined): void {
    const normalizedStringId = typeof stringId === 'string' ? stringId : undefined;
    this.tunerService.selectString(normalizedStringId ?? AUTO_TUNER_STRING_ID);
  }

  protected async toggleListening(): Promise<void> {
    const status = this.tunerState().status;

    if (status === 'listening') {
      await this.tunerService.stop();
      return;
    }

    if (status === 'requesting') {
      return;
    }

    await this.tunerService.start();
  }

  ionViewDidLeave(): void {
    void this.tunerService.stop();
  }

  ngOnDestroy(): void {
    void this.tunerService.stop();
  }

  private buildStatusLabel(state: TunerState): string {
    if (state.direction === 'in-tune') {
      return 'In tune';
    }

    if (state.direction === 'flat') {
      return 'Tune up';
    }

    if (state.direction === 'sharp') {
      return 'Tune down';
    }

    if (state.status === 'requesting') {
      return 'Starting';
    }

    if (state.status === 'listening') {
      return 'Listening';
    }

    return 'Ready';
  }
}