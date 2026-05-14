const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const SHARP_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function noteToMidi(note: string): number {
  const match = note.trim().match(/^([A-Ga-g])([#b]?)(-?\d+)$/);

  if (!match) {
    throw new Error(`Unsupported note format: ${note}`);
  }

  const [, rawLetter, accidentalRaw, octaveRaw] = match;
  const letter = rawLetter.toUpperCase();
  const accidental = accidentalRaw === '#'
    ? 1
    : accidentalRaw === 'b'
      ? -1
      : 0;

  return (Number(octaveRaw) + 1) * 12 + NOTE_OFFSETS[letter] + accidental;
}

export function midiToNoteName(midi: number): string {
  const roundedMidi = Math.round(midi);
  const noteName = SHARP_NOTE_NAMES[((roundedMidi % 12) + 12) % 12];
  const octave = Math.floor(roundedMidi / 12) - 1;

  return `${noteName}${octave}`;
}

export function frequencyFromMidi(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function frequencyToMidi(frequency: number): number {
  return 69 + 12 * Math.log2(frequency / 440);
}

export function centsBetweenFrequencies(actualFrequency: number, targetFrequency: number): number {
  return 1200 * Math.log2(actualFrequency / targetFrequency);
}

export function clampNumber(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}