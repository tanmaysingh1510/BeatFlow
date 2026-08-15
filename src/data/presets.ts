import { SoundscapePreset } from '../types/index.ts';

export const DEFAULT_PRESETS: SoundscapePreset[] = [
  {
    id: 'dsa-grind',
    name: 'Midnight Hacker / DSA Grind',
    description: '40Hz Gamma waves paired with heavy monsoon rain and deep cyber drone for peak algorithmic problem-solving.',
    channels: {
      rain: 0.75,
      thunder: 0.4,
      drone: 0.35,
      fire: 0.0,
      waves: 0.0
    },
    binaural: {
      enabled: true,
      waveType: 'gamma',
      beatHz: 40,
      carrierHz: 216,
      volume: 0.4
    },
    visualTheme: 'cyberpunk'
  },
  {
    id: 'monsoon-coffee',
    name: 'Monsoon Study Cafe',
    description: 'Soothing rainfall and warm fireplace embers with 10Hz Alpha brainwaves for relaxed, uninterrupted reading.',
    channels: {
      rain: 0.8,
      thunder: 0.2,
      fire: 0.35,
      drone: 0.0,
      waves: 0.15
    },
    binaural: {
      enabled: true,
      waveType: 'alpha',
      beatHz: 10,
      carrierHz: 200,
      volume: 0.3
    },
    visualTheme: 'cosmic'
  },
  {
    id: 'deep-space',
    name: 'Deep Space Odyssey',
    description: 'Deep resonant 95Hz cosmic drone and distant sub-bass rumble with 6Hz Theta waves for creative architecture & intuition.',
    channels: {
      rain: 0.0,
      thunder: 0.5,
      drone: 0.85,
      fire: 0.0,
      waves: 0.3
    },
    binaural: {
      enabled: true,
      waveType: 'theta',
      beatHz: 6,
      carrierHz: 160,
      volume: 0.45
    },
    visualTheme: 'cosmic'
  },
  {
    id: 'zen-temple',
    name: 'Zen Temple Sanctuary',
    description: 'Harmonic ocean swells and gentle rain paired with calming Alpha waves on a distraction-free minimalist canvas.',
    channels: {
      rain: 0.45,
      thunder: 0.0,
      drone: 0.15,
      fire: 0.0,
      waves: 0.7
    },
    binaural: {
      enabled: true,
      waveType: 'alpha',
      beatHz: 10,
      carrierHz: 240,
      volume: 0.25
    },
    visualTheme: 'zen'
  },
  {
    id: 'late-night-debug',
    name: 'Late Night Debugger',
    description: '18Hz Beta focus waves with steady rain and crackling embers designed for resolving complex code bugs.',
    channels: {
      rain: 0.65,
      thunder: 0.25,
      drone: 0.2,
      fire: 0.4,
      waves: 0.0
    },
    binaural: {
      enabled: true,
      waveType: 'beta',
      beatHz: 18,
      carrierHz: 216,
      volume: 0.35
    },
    visualTheme: 'mandala'
  }
];

const LOCAL_STORAGE_KEY = 'beatflow_custom_presets';

export function loadCustomPresets(): SoundscapePreset[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomPreset(preset: SoundscapePreset): SoundscapePreset[] {
  const existing = loadCustomPresets();
  const updated = [...existing.filter(p => p.id !== preset.id), preset];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save preset to localStorage', e);
  }
  return updated;
}

export function deleteCustomPreset(presetId: string): SoundscapePreset[] {
  const existing = loadCustomPresets();
  const updated = existing.filter(p => p.id !== presetId);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete preset from localStorage', e);
  }
  return updated;
}
