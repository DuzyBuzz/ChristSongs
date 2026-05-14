export type TunerStatus = 'idle' | 'requesting' | 'listening' | 'denied' | 'unsupported' | 'error';

export type TunerDirection = 'flat' | 'sharp' | 'in-tune' | 'listening';

export type TunerInstrumentId = 'guitar' | 'bass' | 'ukulele';

export interface TunerInstrumentOption {
  readonly id: TunerInstrumentId;
  readonly label: string;
}

export interface TunerStringTarget {
  readonly id: string;
  readonly label: string;
  readonly note: string;
  readonly midi: number;
  readonly frequency: number;
}

export interface TunerPreset {
  readonly id: string;
  readonly instrumentId: TunerInstrumentId;
  readonly instrumentLabel: string;
  readonly name: string;
  readonly description: string;
  readonly strings: readonly TunerStringTarget[];
}

export interface PitchDetectionReading {
  readonly frequency: number;
  readonly midi: number;
  readonly note: string;
  readonly clarity: number;
}

export interface TunerState {
  readonly status: TunerStatus;
  readonly message: string;
  readonly preset: TunerPreset;
  readonly selectedStringId: string;
  readonly detectedFrequency: number | null;
  readonly detectedNote: string;
  readonly clarity: number;
  readonly centsOffset: number | null;
  readonly direction: TunerDirection;
  readonly targetString: TunerStringTarget | null;
}

export const AUTO_TUNER_STRING_ID = 'auto';
export const IN_TUNE_CENTS_THRESHOLD = 5;