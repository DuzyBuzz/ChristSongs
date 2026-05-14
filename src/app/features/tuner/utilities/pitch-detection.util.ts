import { PitchDetectionReading } from '../models/tuner.model';
import { frequencyToMidi, midiToNoteName } from './tuning-note.util';

const EDGE_THRESHOLD = 0.02;
const MAXIMUM_FREQUENCY = 1200;
const MINIMUM_CLARITY = 0.55;
const MINIMUM_FREQUENCY = 60;
const MINIMUM_SIGNAL_LEVEL = 0.01;

export function detectPitch(samples: Float32Array, sampleRate: number): PitchDetectionReading | null {
  const rms = calculateRootMeanSquare(samples);

  if (rms < MINIMUM_SIGNAL_LEVEL) {
    return null;
  }

  const trimmedSamples = trimSamples(samples);

  if (trimmedSamples.length < 3) {
    return null;
  }

  const correlations = new Float32Array(trimmedSamples.length);

  for (let lag = 0; lag < trimmedSamples.length; lag += 1) {
    let correlation = 0;

    for (let index = 0; index < trimmedSamples.length - lag; index += 1) {
      correlation += trimmedSamples[index] * trimmedSamples[index + lag];
    }

    correlations[lag] = correlation;
  }

  if (correlations[0] === 0) {
    return null;
  }

  let firstDip = 0;

  while (
    firstDip + 1 < correlations.length
    && correlations[firstDip] > correlations[firstDip + 1]
  ) {
    firstDip += 1;
  }

  const minLag = Math.max(1, Math.floor(sampleRate / MAXIMUM_FREQUENCY));
  const maxLag = Math.min(
    correlations.length - 2,
    Math.floor(sampleRate / MINIMUM_FREQUENCY),
  );

  let bestLag = -1;
  let bestCorrelation = -1;

  for (let lag = Math.max(firstDip, minLag); lag <= maxLag; lag += 1) {
    if (correlations[lag] > bestCorrelation) {
      bestCorrelation = correlations[lag];
      bestLag = lag;
    }
  }

  if (bestLag <= 0) {
    return null;
  }

  const refinedLag = bestLag + interpolatePeakOffset(
    correlations[bestLag - 1],
    correlations[bestLag],
    correlations[bestLag + 1],
  );
  const clarity = bestCorrelation / correlations[0];
  const frequency = sampleRate / refinedLag;

  if (
    !Number.isFinite(frequency)
    || frequency < MINIMUM_FREQUENCY
    || frequency > MAXIMUM_FREQUENCY
    || clarity < MINIMUM_CLARITY
  ) {
    return null;
  }

  const midi = frequencyToMidi(frequency);

  return {
    frequency,
    midi,
    note: midiToNoteName(midi),
    clarity,
  };
}

function calculateRootMeanSquare(samples: Float32Array): number {
  let sum = 0;

  for (const sample of samples) {
    sum += sample * sample;
  }

  return Math.sqrt(sum / samples.length);
}

function trimSamples(samples: Float32Array): Float32Array {
  let start = 0;
  let end = samples.length - 1;

  while (start < samples.length / 2 && Math.abs(samples[start]) < EDGE_THRESHOLD) {
    start += 1;
  }

  while (end > start && Math.abs(samples[end]) < EDGE_THRESHOLD) {
    end -= 1;
  }

  return samples.subarray(start, end + 1);
}

function interpolatePeakOffset(previous: number, current: number, next: number): number {
  const denominator = 2 * (2 * current - previous - next);

  if (denominator === 0) {
    return 0;
  }

  return (next - previous) / denominator;
}