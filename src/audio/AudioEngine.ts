import { SoundChannelId, BrainwaveType, BinauralConfig } from '../types/index.ts';
import {
  generatePinkNoiseBuffer,
  generateBrownNoiseBuffer,
  generateFireplaceBuffer
} from './NoiseGenerators.ts';
import { BinauralEngine } from './BinauralBeat.ts';

interface ChannelNodeChain {
  source: AudioBufferSourceNode | null;
  filter: BiquadFilterNode;
  gain: GainNode;
  buffer: AudioBuffer;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isInitialized = false;
  private isPlaying = false;

  private binaural: BinauralEngine = new BinauralEngine();
  private channels: Map<SoundChannelId, ChannelNodeChain> = new Map();

  /**
   * Initializes the AudioContext and Audio Graph
   * Must be triggered by a user gesture (e.g. clicking 'Start Flow')
   */
  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // 1. Master Output Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    // 2. Real-Time AnalyserNode (for FFT spectrum & 60fps Canvas in Step 4)
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256; // 128 frequency bins
    this.analyser.smoothingTimeConstant = 0.85;

    // Connect Master -> Analyser -> Speakers
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // 3. Initialize Binaural Beat Engine Sub-Graph
    this.binaural.init(this.ctx, this.masterGain);

    // 4. Pre-generate procedural noise buffers
    const pinkBuffer = generatePinkNoiseBuffer(this.ctx, 5);
    const brownBuffer = generateBrownNoiseBuffer(this.ctx, 5);
    const fireBuffer = generateFireplaceBuffer(this.ctx, 5);

    // 5. Set up individual sound channels with specialized Biquad Filters
    this.setupChannel('rain', pinkBuffer, 'bandpass', 1200, 0.7);
    this.setupChannel('thunder', brownBuffer, 'lowpass', 180, 2.0);
    this.setupChannel('fire', fireBuffer, 'bandpass', 2400, 1.2);
    this.setupChannel('drone', brownBuffer, 'lowpass', 95, 3.5);
    this.setupChannel('waves', brownBuffer, 'lowpass', 450, 1.0);

    this.isInitialized = true;
  }

  /**
   * Sets up a single channel's node chain: BufferSource -> Filter -> Gain -> Master
   */
  private setupChannel(
    id: SoundChannelId,
    buffer: AudioBuffer,
    filterType: BiquadFilterType,
    cutoffHz: number,
    qFactor: number = 1
  ): void {
    if (!this.ctx || !this.masterGain) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(cutoffHz, this.ctx.currentTime);
    filter.Q.setValueAtTime(qFactor, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    filter.connect(gain);
    gain.connect(this.masterGain);

    this.channels.set(id, {
      source: null,
      filter,
      gain,
      buffer
    });
  }

  /**
   * Starts playback across all configured channel buffer loops and binaural oscillators
   */
  public async play(): Promise<void> {
    if (!this.isInitialized || !this.ctx) {
      await this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return;

    // Start buffer sources for all channels
    this.channels.forEach((chain) => {
      if (!this.ctx) return;
      const source = this.ctx.createBufferSource();
      source.buffer = chain.buffer;
      source.loop = true;
      source.connect(chain.filter);
      source.start(0);
      chain.source = source;
    });

    // Start binaural beat oscillators
    this.binaural.start();

    this.isPlaying = true;
  }

  /**
   * Pauses all audio playback
   */
  public pause(): void {
    if (!this.isPlaying) return;

    this.channels.forEach((chain) => {
      if (chain.source) {
        try {
          chain.source.stop();
          chain.source.disconnect();
        } catch {
          // Ignore if already stopped
        }
        chain.source = null;
      }
    });

    this.binaural.stop();
    this.isPlaying = false;
  }

  /**
   * Smoothly adjusts a channel's volume (0.0 to 1.0)
   */
  public setChannelVolume(id: SoundChannelId, volume: number): void {
    const chain = this.channels.get(id);
    if (chain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      chain.gain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Smoothly adjusts master volume (0.0 to 1.0)
   */
  public setMasterVolume(volume: number): void {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Synthesizes a soothing harmonic Zen focus chime using multi-oscillator overtones
   * and an exponential decay acoustic envelope (No audio files needed!)
   */
  public playChime(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const fundamentalHz = 528; // Solfeggio frequency / Zen clarity tone
    const harmonics = [1, 2.01, 3.02, 4.05]; // Natural acoustic bell overtones
    const gains = [0.4, 0.2, 0.1, 0.05];

    harmonics.forEach((multiplier, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamentalHz * multiplier, now);

      // Fast attack (10ms) followed by long, natural resonant exponential decay (3.5s)
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gains[i], now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.3);

      setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Safe cleanup
        }
      }, 3500);
    });
  }

  // Binaural Beat Controls
  public setBinauralWave(wave: BrainwaveType): void {
    this.binaural.setWaveType(wave);
  }

  public setBinauralBeatHz(hz: number): void {
    this.binaural.setBeatHz(hz);
  }

  public setBinauralCarrierHz(hz: number): void {
    this.binaural.setCarrierHz(hz);
  }

  public setBinauralVolume(volume: number): void {
    this.binaural.setVolume(volume);
  }

  public setBinauralEnabled(enabled: boolean): void {
    this.binaural.setEnabled(enabled);
  }

  public getBinauralConfig(): BinauralConfig {
    return this.binaural.getConfig();
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public getMasterGain(): GainNode | null {
    return this.masterGain;
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();
