/**
 * NOISE GENERATORS & DSP ALGORITHMS
 * 
 * Generates continuous audio buffers using digital signal processing algorithms
 * instead of downloading large, repetitive MP3 files.
 */

/**
 * Creates an empty stereo or mono AudioBuffer in memory
 */
export function createBuffer(
  ctx: AudioContext,
  durationSeconds: number = 5,
  channels: number = 2
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const frameCount = sampleRate * durationSeconds;
  return ctx.createBuffer(channels, frameCount, sampleRate);
}

/**
 * 1. PINK NOISE (1/f Power Spectrum)
 * Used as the core acoustic foundation for Natural Rainfall and Gentle Waterfalls.
 * Implemented using Paul Kellet's refined filter method on white noise.
 */
export function generatePinkNoiseBuffer(ctx: AudioContext, durationSeconds: number = 5): AudioBuffer {
  const buffer = createBuffer(ctx, durationSeconds, 2);
  const sampleRate = ctx.sampleRate;
  const frameCount = sampleRate * durationSeconds;

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1; // Random float between -1.0 and +1.0

      // Cascaded 1st-order IIR filters to achieve a -3dB/octave slope (Pink Noise)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;

      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      // Scale to prevent clipping
      data[i] = pink * 0.11;
    }
  }

  return buffer;
}

/**
 * 2. BROWN / RED NOISE (1/f^2 Power Spectrum)
 * Deep, low-frequency warm rumble used for Thunder, Distant Storms, and Deep Space Drones.
 * Implemented via numerical integration (random walk) of white noise.
 */
export function generateBrownNoiseBuffer(ctx: AudioContext, durationSeconds: number = 5): AudioBuffer {
  const buffer = createBuffer(ctx, durationSeconds, 2);
  const sampleRate = ctx.sampleRate;
  const frameCount = sampleRate * durationSeconds;

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0.0;

    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      // Leaky integrator: integrates random steps while preventing DC drift
      lastOut = (lastOut + 0.02 * white) / 1.02;
      // Gain boost for low frequencies
      data[i] = lastOut * 3.5;
    }
  }

  return buffer;
}

/**
 * 3. FIREPLACE CRACKLE (Poisson-Distributed Impulse Burst)
 * Simulates real wood fire by generating low-frequency thermal hiss paired with
 * sparse, randomized acoustic micro-explosions (crackles).
 */
export function generateFireplaceBuffer(ctx: AudioContext, durationSeconds: number = 5): AudioBuffer {
  const buffer = createBuffer(ctx, durationSeconds, 2);
  const sampleRate = ctx.sampleRate;
  const frameCount = sampleRate * durationSeconds;

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0.0;

    for (let i = 0; i < frameCount; i++) {
      // Subtle background warm ember hiss
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.015 * white) / 1.015;
      let sample = lastOut * 0.4;

      // Poisson-distributed micro-crackle bursts (1 in ~800 chance per sample)
      if (Math.random() < 0.0006) {
        const crackleStrength = Math.random() * 0.8 + 0.2;
        sample += (Math.random() * 2 - 1) * crackleStrength;
      }

      data[i] = sample;
    }
  }

  return buffer;
}
