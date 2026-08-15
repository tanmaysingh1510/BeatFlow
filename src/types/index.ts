export type BrainwaveType = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

export interface BrainwavePreset {
  type: BrainwaveType;
  name: string;
  range: string;
  defaultHz: number;
  description: string;
  idealFor: string;
}

export interface BinauralConfig {
  enabled: boolean;
  carrierHz: number;
  beatHz: number;
  waveType: BrainwaveType;
  volume: number;
}

export type SoundChannelId = 'rain' | 'thunder' | 'fire' | 'drone' | 'waves' | 'wind';

export interface SoundChannel {
  id: SoundChannelId;
  name: string;
  volume: number;      // 0.0 to 1.0
  muted: boolean;
  description: string;
}

export type VisualTheme = 'cosmic' | 'cyberpunk' | 'matrix' | 'zen' | 'mandala';

export interface SoundscapePreset {
  id: string;
  name: string;
  description: string;
  channels: Partial<Record<SoundChannelId, number>>;
  binaural: Partial<BinauralConfig>;
  visualTheme: VisualTheme;
}

export interface AIPlanResponse {
  sessionName: string;
  recommendedDurationMinutes: number;
  binaural: {
    carrierHz: number;
    targetWave: BrainwaveType;
    beatHz: number;
    volume: number;
  };
  soundscape: Partial<Record<SoundChannelId, number>>;
  visualTheme: VisualTheme;
  focusQuote: string;
  microGoals: string[];
}

export interface TimerState {
  isRunning: boolean;
  durationSeconds: number;
  remainingSeconds: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  completedSessions: number;
}
