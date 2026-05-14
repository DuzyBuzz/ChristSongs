import {
  TunerInstrumentOption,
  TunerPreset,
  TunerStringTarget,
} from '../models/tuner.model';
import { frequencyFromMidi, noteToMidi } from '../utilities/tuning-note.util';

function buildStringTarget(id: string, label: string, note: string): TunerStringTarget {
  const midi = noteToMidi(note);

  return {
    id,
    label,
    note,
    midi,
    frequency: frequencyFromMidi(midi),
  };
}

export const TUNER_INSTRUMENTS: readonly TunerInstrumentOption[] = [
  {
    id: 'guitar',
    label: 'Guitar',
  },
  {
    id: 'bass',
    label: 'Bass',
  },
  {
    id: 'ukulele',
    label: 'Ukulele',
  },
] as const;

export const TUNER_PRESETS: readonly TunerPreset[] = [
  {
    id: 'guitar-standard',
    instrumentId: 'guitar',
    instrumentLabel: 'Guitar',
    name: 'Standard',
    description: 'E A D G B E',
    strings: [
      buildStringTarget('guitar-6', '6th string', 'E2'),
      buildStringTarget('guitar-5', '5th string', 'A2'),
      buildStringTarget('guitar-4', '4th string', 'D3'),
      buildStringTarget('guitar-3', '3rd string', 'G3'),
      buildStringTarget('guitar-2', '2nd string', 'B3'),
      buildStringTarget('guitar-1', '1st string', 'E4'),
    ],
  },
  {
    id: 'guitar-drop-d',
    instrumentId: 'guitar',
    instrumentLabel: 'Guitar',
    name: 'Drop D',
    description: 'D A D G B E',
    strings: [
      buildStringTarget('guitar-dropd-6', '6th string', 'D2'),
      buildStringTarget('guitar-dropd-5', '5th string', 'A2'),
      buildStringTarget('guitar-dropd-4', '4th string', 'D3'),
      buildStringTarget('guitar-dropd-3', '3rd string', 'G3'),
      buildStringTarget('guitar-dropd-2', '2nd string', 'B3'),
      buildStringTarget('guitar-dropd-1', '1st string', 'E4'),
    ],
  },
  {
    id: 'bass-standard',
    instrumentId: 'bass',
    instrumentLabel: 'Bass',
    name: 'Standard',
    description: 'E A D G',
    strings: [
      buildStringTarget('bass-4', '4th string', 'E1'),
      buildStringTarget('bass-3', '3rd string', 'A1'),
      buildStringTarget('bass-2', '2nd string', 'D2'),
      buildStringTarget('bass-1', '1st string', 'G2'),
    ],
  },
  {
    id: 'bass-drop-d',
    instrumentId: 'bass',
    instrumentLabel: 'Bass',
    name: 'Drop D',
    description: 'D A D G',
    strings: [
      buildStringTarget('bass-dropd-4', '4th string', 'D1'),
      buildStringTarget('bass-dropd-3', '3rd string', 'A1'),
      buildStringTarget('bass-dropd-2', '2nd string', 'D2'),
      buildStringTarget('bass-dropd-1', '1st string', 'G2'),
    ],
  },
  {
    id: 'ukulele-standard',
    instrumentId: 'ukulele',
    instrumentLabel: 'Ukulele',
    name: 'Standard',
    description: 'G C E A',
    strings: [
      buildStringTarget('ukulele-4', '4th string', 'G4'),
      buildStringTarget('ukulele-3', '3rd string', 'C4'),
      buildStringTarget('ukulele-2', '2nd string', 'E4'),
      buildStringTarget('ukulele-1', '1st string', 'A4'),
    ],
  },
  {
    id: 'ukulele-low-g',
    instrumentId: 'ukulele',
    instrumentLabel: 'Ukulele',
    name: 'Low G',
    description: 'G C E A with a low 4th string',
    strings: [
      buildStringTarget('ukulele-lowg-4', '4th string', 'G3'),
      buildStringTarget('ukulele-lowg-3', '3rd string', 'C4'),
      buildStringTarget('ukulele-lowg-2', '2nd string', 'E4'),
      buildStringTarget('ukulele-lowg-1', '1st string', 'A4'),
    ],
  },
] as const;

export const DEFAULT_TUNER_PRESET = TUNER_PRESETS[0];