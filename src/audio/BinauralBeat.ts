import { BrainwavePreset, BrainwaveType, BinauralConfig } from '../types/index.ts';

export const BRAINWAVE_PRESETS: Record<BrainwaveType, BrainwavePreset> = {
  delta: {
    type: 'delta',
    name: 'Delta',
    range: '0.5 – 4 Hz',
    defaultHz: 2.5,
    description: 'Deep physical recovery, restorative rest & dreamless state',
    idealFor: 'Power naps & deep decompression'
  },
  theta: {
    type: 'theta',
    name: 'Theta',
    range: '4 – 8 Hz',
    defaultHz: 6.0,
    description: 'Deep meditation, daydreaming, flow state & intuition',
    idealFor: 'Creative brainstorming & conceptual design'
  },
  alpha: {
    type: 'alpha',
    name: 'Alpha',
    range: '8 – 14 Hz',
    defaultHz: 10.0,
    description: 'Calm alertness, reduced anxiety & passive learning',
    idealFor: 'Reading textbook chapters & documentation'
  },
  beta: {
    type: 'beta',
    name: 'Beta',
    range: '14 – 30 Hz',
    defaultHz: 18.0,
    description: 'High alertness, active analytical thinking & focus',
    idealFor: 'Writing code, solving assignments & writing reports'
  },
  gamma: {
    type: 'gamma',
    name: 'Gamma',
    range: '30 – 50 Hz',
    defaultHz: 40.0,
    description: 'Peak cognitive processing, rapid memory recall & flow',
    idealFor: 'Competitive programming, LeetCode & complex debugging'
  }
};

export class BinauralEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private pannerLeft: StereoPannerNode | null = null;
  private pannerRight: StereoPannerNode | null = null;
  private binauralGain: GainNode | null = null;

  private config: BinauralConfig = {
    enabled: true,
    carrierHz: 216, // Soothing warm carrier frequency
    beatHz: 40,     // Default 40Hz Gamma (Peak focus)
    waveType: 'gamma',
    volume: 0.35
  };

  private isPlaying = false;

  public init(ctx: AudioContext, masterGain: GainNode): void {
    this.ctx = ctx;
    this.masterGain = masterGain;

    // Dedicated Gain for Binaural Beat
    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.binauralGain.connect(this.masterGain);

    // Hard Stereo Panners (Left: -1.0, Right: +1.0)
    this.pannerLeft = this.ctx.createStereoPanner();
    this.pannerLeft.pan.setValueAtTime(-1.0, this.ctx.currentTime);
    this.pannerLeft.connect(this.binauralGain);

    this.pannerRight = this.ctx.createStereoPanner();
    this.pannerRight.pan.setValueAtTime(1.0, this.ctx.currentTime);
    this.pannerRight.connect(this.binauralGain);
  }

  public start(): void {
    if (!this.ctx || !this.pannerLeft || !this.pannerRight || !this.binauralGain) return;
    if (this.isPlaying) return;

    const leftFreq = this.config.carrierHz;
    const rightFreq = this.config.carrierHz + this.config.beatHz;

    // Create dual pure sine wave oscillators
    this.oscLeft = this.ctx.createOscillator();
    this.oscLeft.type = 'sine';
    this.oscLeft.frequency.setValueAtTime(leftFreq, this.ctx.currentTime);
    this.oscLeft.connect(this.pannerLeft);
    this.oscLeft.start();

    this.oscRight = this.ctx.createOscillator();
    this.oscRight.type = 'sine';
    this.oscRight.frequency.setValueAtTime(rightFreq, this.ctx.currentTime);
    this.oscRight.connect(this.pannerRight);
    this.oscRight.start();

    const targetGain = this.config.enabled ? this.config.volume : 0;
    this.binauralGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);

    this.isPlaying = true;
  }

  public stop(): void {
    if (!this.isPlaying) return;

    if (this.binauralGain && this.ctx) {
      this.binauralGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    }

    setTimeout(() => {
      try {
        if (this.oscLeft) {
          this.oscLeft.stop();
          this.oscLeft.disconnect();
          this.oscLeft = null;
        }
        if (this.oscRight) {
          this.oscRight.stop();
          this.oscRight.disconnect();
          this.oscRight = null;
        }
      } catch {
        // Safe disconnect
      }
      this.isPlaying = false;
    }, 50);
  }

  public setWaveType(type: BrainwaveType): void {
    const preset = BRAINWAVE_PRESETS[type];
    this.config.waveType = type;
    this.config.beatHz = preset.defaultHz;
    this.updateFrequencies();
  }

  public setBeatHz(hz: number): void {
    this.config.beatHz = Math.max(0.5, Math.min(50, hz));
    this.updateFrequencies();
  }

  public setCarrierHz(hz: number): void {
    this.config.carrierHz = Math.max(80, Math.min(450, hz));
    this.updateFrequencies();
  }

  public setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    if (this.binauralGain && this.ctx && this.isPlaying) {
      const target = this.config.enabled ? this.config.volume : 0;
      this.binauralGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (this.binauralGain && this.ctx && this.isPlaying) {
      const target = enabled ? this.config.volume : 0;
      this.binauralGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  private updateFrequencies(): void {
    if (!this.ctx) return;
    const leftFreq = this.config.carrierHz;
    const rightFreq = this.config.carrierHz + this.config.beatHz;

    // Smooth frequency morphing prevents harsh pitch shifting
    if (this.oscLeft) {
      this.oscLeft.frequency.setTargetAtTime(leftFreq, this.ctx.currentTime, 0.1);
    }
    if (this.oscRight) {
      this.oscRight.frequency.setTargetAtTime(rightFreq, this.ctx.currentTime, 0.1);
    }
  }

  public getConfig(): BinauralConfig {
    return { ...this.config };
  }
}
