export type AudioBands = {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
  beat: number;
};

// Use Hz rather than fixed FFT indices so every sample rate maps correctly.
export function frequencyLevel(
  data: Uint8Array,
  sampleRate: number,
  fftSize: number,
  lowHz: number,
  highHz: number,
) {
  const binHz = sampleRate / fftSize;
  const start = Math.max(1, Math.floor(lowHz / binHz));
  const end = Math.min(
    data.length,
    Math.max(start + 1, Math.ceil(highHz / binHz)),
  );
  let power = 0;
  for (let index = start; index < end; index++) {
    power += (data[index] / 255) ** 2;
  }
  // Preserve dynamics instead of clipping ordinary music to a constant 1.
  return end > start ? (power / (end - start)) ** 1.25 : 0;
}

export function followLevel(current: number, target: number, delta: number) {
  const response = target > current ? 0.025 : 0.14;
  return current + (target - current) * (1 - Math.exp(-delta / response));
}

export function spectrumRange(
  index: number,
  count: number,
  sampleRate: number,
) {
  const low = 30;
  const high = Math.min(16000, sampleRate);
  // DOM order is top to bottom: treble first, bass last.
  const band = count - 1 - index;
  return [
    low * (high / low) ** (band / count),
    low * (high / low) ** ((band + 1) / count),
  ];
}
