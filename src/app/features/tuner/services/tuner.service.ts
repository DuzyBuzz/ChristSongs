import { computed, Injectable, signal } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { DEFAULT_TUNER_PRESET, TUNER_PRESETS } from '../data/tuner-presets.data';
import {
  AUTO_TUNER_STRING_ID,
  IN_TUNE_CENTS_THRESHOLD,
  PitchDetectionReading,
  TunerDirection,
  TunerPreset,
  TunerState,
  TunerStringTarget,
} from '../models/tuner.model';
import { detectPitch } from '../utilities/pitch-detection.util';
import { centsBetweenFrequencies } from '../utilities/tuning-note.util';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const INPUT_BUFFER_SIZE = 2048;
const PROCESSING_INTERVAL_MS = 80;

@Injectable({
  providedIn: 'root',
})
export class TunerService {
  private readonly inputBuffer = new Float32Array(INPUT_BUFFER_SIZE);
  private readonly stateSignal = signal<TunerState>({
    status: 'idle',
    message: 'Tap start and pluck one string at a time.',
    preset: DEFAULT_TUNER_PRESET,
    selectedStringId: AUTO_TUNER_STRING_ID,
    detectedFrequency: null,
    detectedNote: '',
    clarity: 0,
    centsOffset: null,
    direction: 'listening',
    targetString: null,
  });

  private animationFrameId: number | null = null;
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private lastInTuneTargetId = '';
  private lastProcessedAt = 0;
  private lastReading: PitchDetectionReading | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private wasInTune = false;

  readonly state = computed(() => this.stateSignal());

  selectPreset(presetId: string): void {
    const preset = this.findPreset(presetId);
    const currentState = this.stateSignal();
    const selectedStringId = currentState.selectedStringId === AUTO_TUNER_STRING_ID
      || preset.strings.some((candidate) => candidate.id === currentState.selectedStringId)
        ? currentState.selectedStringId
        : AUTO_TUNER_STRING_ID;

    this.stateSignal.update((state) => ({
      ...state,
      preset,
      selectedStringId,
    }));

    this.refreshReadout();
  }

  selectString(stringId: string): void {
    this.stateSignal.update((state) => ({
      ...state,
      selectedStringId: stringId || AUTO_TUNER_STRING_ID,
    }));

    this.refreshReadout();
  }

  async start(): Promise<void> {
    if (this.stateSignal().status === 'requesting') {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      this.stateSignal.update((state) => ({
        ...state,
        status: 'unsupported',
        message: 'This device cannot use the live tuner.',
      }));
      return;
    }

    if (this.audioContext && this.analyser) {
      await this.audioContext.resume();
      this.stateSignal.update((state) => ({
        ...state,
        status: 'listening',
        message: 'Listening. Pluck one string at a time.',
      }));
      this.startProcessingLoop();
      return;
    }

    this.stateSignal.update((state) => ({
      ...state,
      status: 'requesting',
      message: 'Asking for microphone access...',
    }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        },
      });
      const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop());
        this.stateSignal.update((state) => ({
          ...state,
          status: 'unsupported',
          message: 'This device cannot use the live tuner.',
        }));
        return;
      }

      const audioContext = new AudioContextConstructor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = INPUT_BUFFER_SIZE;
      analyser.smoothingTimeConstant = 0;

      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNode.connect(analyser);

      this.audioContext = audioContext;
      this.analyser = analyser;
      this.mediaStream = stream;
      this.sourceNode = sourceNode;
      this.stateSignal.update((state) => ({
        ...state,
        status: 'listening',
        message: 'Listening. Pluck one string at a time.',
      }));
      this.startProcessingLoop();
    } catch (error) {
      await this.releaseAudioResources();
      this.stateSignal.update((state) => ({
        ...state,
        status: this.isPermissionDenied(error) ? 'denied' : 'error',
        message: this.isPermissionDenied(error)
          ? 'Microphone access is off. Allow it to use the tuner.'
          : 'The tuner could not start right now.',
      }));
    }
  }

  async stop(): Promise<void> {
    await this.releaseAudioResources();
    this.lastReading = null;
    this.lastInTuneTargetId = '';
    this.wasInTune = false;

    this.stateSignal.update((state) => ({
      ...state,
      status: 'idle',
      message: 'Tap start and pluck one string at a time.',
      detectedFrequency: null,
      detectedNote: '',
      clarity: 0,
      centsOffset: null,
      direction: 'listening',
      targetString: state.selectedStringId === AUTO_TUNER_STRING_ID
        ? null
        : this.getSelectedString(state.preset, state.selectedStringId),
    }));
  }

  private applyReading(reading: PitchDetectionReading | null): void {
    const currentState = this.stateSignal();

    if (!reading) {
      this.wasInTune = false;
      this.lastInTuneTargetId = '';
      this.stateSignal.update((state) => ({
        ...state,
        message: state.status === 'listening'
          ? 'Pluck one string so I can hear it.'
          : state.message,
        detectedFrequency: null,
        detectedNote: '',
        clarity: 0,
        centsOffset: null,
        direction: 'listening',
        targetString: state.selectedStringId === AUTO_TUNER_STRING_ID
          ? null
          : this.getSelectedString(state.preset, state.selectedStringId),
      }));
      return;
    }

    const targetString = this.resolveTargetString(
      currentState.preset,
      currentState.selectedStringId,
      reading.frequency,
    );
    const centsOffset = targetString
      ? centsBetweenFrequencies(reading.frequency, targetString.frequency)
      : null;
    const direction = this.resolveDirection(centsOffset);

    this.stateSignal.update((state) => ({
      ...state,
      message: this.buildHintMessage(direction, targetString),
      detectedFrequency: reading.frequency,
      detectedNote: reading.note,
      clarity: reading.clarity,
      centsOffset,
      direction,
      targetString,
    }));

    this.notifyWhenInTune(direction, targetString);
  }

  private buildHintMessage(direction: TunerDirection, targetString: TunerStringTarget | null): string {
    if (direction === 'in-tune' && targetString) {
      return `${targetString.note} is in tune.`;
    }

    if (direction === 'flat') {
      return 'Tune up a little.';
    }

    if (direction === 'sharp') {
      return 'Tune down a little.';
    }

    return 'Pluck one string so I can hear it.';
  }

  private findPreset(presetId: string): TunerPreset {
    return TUNER_PRESETS.find((candidate) => candidate.id === presetId) ?? DEFAULT_TUNER_PRESET;
  }

  private getSelectedString(preset: TunerPreset, stringId: string): TunerStringTarget | null {
    return preset.strings.find((candidate) => candidate.id === stringId) ?? null;
  }

  private isPermissionDenied(error: unknown): boolean {
    return error instanceof DOMException
      && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError');
  }

  private notifyWhenInTune(direction: TunerDirection, targetString: TunerStringTarget | null): void {
    if (direction !== 'in-tune' || !targetString) {
      this.wasInTune = false;
      this.lastInTuneTargetId = '';
      return;
    }

    if (this.wasInTune && this.lastInTuneTargetId === targetString.id) {
      return;
    }

    this.wasInTune = true;
    this.lastInTuneTargetId = targetString.id;
    void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
  }

  private refreshReadout(): void {
    if (this.lastReading) {
      this.applyReading(this.lastReading);
      return;
    }

    this.stateSignal.update((state) => ({
      ...state,
      targetString: state.selectedStringId === AUTO_TUNER_STRING_ID
        ? null
        : this.getSelectedString(state.preset, state.selectedStringId),
      message: state.status === 'listening'
        ? 'Listening. Pluck one string at a time.'
        : 'Tap start and pluck one string at a time.',
      detectedFrequency: null,
      detectedNote: '',
      clarity: 0,
      centsOffset: null,
      direction: 'listening',
    }));
  }

  private async releaseAudioResources(): Promise<void> {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.sourceNode?.disconnect();
    this.analyser?.disconnect();
    this.mediaStream?.getTracks().forEach((track) => track.stop());

    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close().catch(() => undefined);
    }

    this.sourceNode = null;
    this.analyser = null;
    this.mediaStream = null;
    this.audioContext = null;
  }

  private resolveDirection(centsOffset: number | null): TunerDirection {
    if (centsOffset === null || !Number.isFinite(centsOffset)) {
      return 'listening';
    }

    if (Math.abs(centsOffset) <= IN_TUNE_CENTS_THRESHOLD) {
      return 'in-tune';
    }

    return centsOffset < 0 ? 'flat' : 'sharp';
  }

  private resolveTargetString(
    preset: TunerPreset,
    selectedStringId: string,
    frequency: number,
  ): TunerStringTarget | null {
    if (selectedStringId !== AUTO_TUNER_STRING_ID) {
      return this.getSelectedString(preset, selectedStringId);
    }

    let closestString = preset.strings[0] ?? null;
    let smallestDistance = Number.POSITIVE_INFINITY;

    for (const stringTarget of preset.strings) {
      const distance = Math.abs(Math.log2(frequency / stringTarget.frequency));

      if (distance < smallestDistance) {
        closestString = stringTarget;
        smallestDistance = distance;
      }
    }

    return closestString;
  }

  private startProcessingLoop(): void {
    if (!this.analyser || !this.audioContext || this.animationFrameId !== null) {
      return;
    }

    this.lastProcessedAt = 0;
    const processFrame = (timestamp: number): void => {
      if (!this.analyser || !this.audioContext) {
        this.animationFrameId = null;
        return;
      }

      if (timestamp - this.lastProcessedAt >= PROCESSING_INTERVAL_MS) {
        this.lastProcessedAt = timestamp;
        this.analyser.getFloatTimeDomainData(this.inputBuffer);
        this.lastReading = detectPitch(this.inputBuffer, this.audioContext.sampleRate);
        this.applyReading(this.lastReading);
      }

      this.animationFrameId = requestAnimationFrame(processFrame);
    };

    this.animationFrameId = requestAnimationFrame(processFrame);
  }
}