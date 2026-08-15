import { useState, useEffect } from 'react';
import {
  Sparkles,
  Headphones,
  Waves,
  Play,
  Pause,
  CloudRain,
  Zap,
  Flame,
  Radio,
  Volume2,
  VolumeX,
  Sliders,
  Eye,
  Keyboard
} from 'lucide-react';
import { audioEngine } from './audio/AudioEngine.ts';
import { SoundChannel, SoundChannelId, BrainwaveType, BinauralConfig, VisualTheme } from './types/index.ts';
import { BinauralPanel } from './components/BinauralPanel.tsx';
import { Visualizer } from './canvas/Visualizer.tsx';

const INITIAL_CHANNELS: SoundChannel[] = [
  { id: 'rain', name: 'Monsoon Rain', volume: 0.6, muted: false, description: 'Pink noise through resonant bandpass filter' },
  { id: 'thunder', name: 'Distant Thunder', volume: 0.3, muted: false, description: 'Brownian low-frequency sub-bass' },
  { id: 'fire', name: 'Warm Fireplace', volume: 0.0, muted: false, description: 'Poisson-distributed micro-crackles' },
  { id: 'drone', name: 'Deep Space Drone', volume: 0.2, muted: false, description: '95Hz resonant ambient cosmic drone' },
  { id: 'waves', name: 'Ocean Swell', volume: 0.0, muted: false, description: 'Modulated low-frequency brownian waves' },
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('cosmic');
  const [keystrokeCount, setKeystrokeCount] = useState<number>(0);
  const [channels, setChannels] = useState<SoundChannel[]>(INITIAL_CHANNELS);
  const [binauralConfig, setBinauralConfig] = useState<BinauralConfig>({
    enabled: true,
    carrierHz: 216,
    beatHz: 40,
    waveType: 'gamma',
    volume: 0.35
  });

  // Toggle global play / pause
  const togglePlay = async () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      await audioEngine.play();
      // Sync channel volumes
      channels.forEach((ch) => {
        audioEngine.setChannelVolume(ch.id, ch.muted ? 0 : ch.volume);
      });
      // Sync binaural settings
      audioEngine.setBinauralEnabled(binauralConfig.enabled);
      audioEngine.setBinauralWave(binauralConfig.waveType);
      audioEngine.setBinauralBeatHz(binauralConfig.beatHz);
      audioEngine.setBinauralCarrierHz(binauralConfig.carrierHz);
      audioEngine.setBinauralVolume(binauralConfig.volume);
      audioEngine.setMasterVolume(masterVolume);
      setIsPlaying(true);
    }
  };

  // Adjust volume for an individual channel
  const handleChannelVolume = (id: SoundChannelId, value: number) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const updated = { ...ch, volume: value, muted: false };
          if (isPlaying) {
            audioEngine.setChannelVolume(id, value);
          }
          return updated;
        }
        return ch;
      })
    );
  };

  // Toggle mute on a single channel
  const handleToggleMute = (id: SoundChannelId) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const nextMuted = !ch.muted;
          const updated = { ...ch, muted: nextMuted };
          if (isPlaying) {
            audioEngine.setChannelVolume(id, nextMuted ? 0 : ch.volume);
          }
          return updated;
        }
        return ch;
      })
    );
  };

  // Master volume change
  const handleMasterVolume = (value: number) => {
    setMasterVolume(value);
    if (isPlaying) {
      audioEngine.setMasterVolume(value);
    }
  };

  // Binaural Beat Handlers
  const handleWaveTypeChange = (type: BrainwaveType) => {
    setBinauralConfig((prev) => {
      const updated = { ...prev, waveType: type };
      audioEngine.setBinauralWave(type);
      return { ...updated, beatHz: audioEngine.getBinauralConfig().beatHz };
    });
  };

  const handleBeatHzChange = (hz: number) => {
    setBinauralConfig((prev) => ({ ...prev, beatHz: hz }));
    audioEngine.setBinauralBeatHz(hz);
  };

  const handleCarrierHzChange = (hz: number) => {
    setBinauralConfig((prev) => ({ ...prev, carrierHz: hz }));
    audioEngine.setBinauralCarrierHz(hz);
  };

  const handleBinauralVolume = (volume: number) => {
    setBinauralConfig((prev) => ({ ...prev, volume }));
    audioEngine.setBinauralVolume(volume);
  };

  const handleToggleBinaural = (enabled: boolean) => {
    setBinauralConfig((prev) => ({ ...prev, enabled }));
    audioEngine.setBinauralEnabled(enabled);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.pause();
    };
  }, []);

  const getChannelIcon = (id: SoundChannelId) => {
    switch (id) {
      case 'rain': return <CloudRain size={20} color="var(--accent-cyan)" />;
      case 'thunder': return <Zap size={20} color="var(--accent-amber)" />;
      case 'fire': return <Flame size={20} color="var(--accent-rose)" />;
      case 'drone': return <Radio size={20} color="var(--accent-indigo)" />;
      case 'waves': return <Waves size={20} color="var(--accent-emerald)" />;
      default: return <Volume2 size={20} />;
    }
  };

  return (
    <div className="app-container">
      {/* Real-time 60 FPS Audio-Reactive Canvas Visualizer with Keystroke Shockwaves */}
      <Visualizer
        theme={visualTheme}
        isPlaying={isPlaying}
        onKeystroke={() => setKeystrokeCount((c) => c + 1)}
      />

      <main className="content-layer">
        {/* Header Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-glass)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlaying ? '0 0 20px var(--accent-cyan-glow)' : 'none',
                transition: 'box-shadow var(--transition-normal)'
              }}
            >
              <Waves size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 className="brand-title">BeatFlow</h1>
                <span className="brand-badge" style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', borderColor: 'hsla(199, 89%, 52%, 0.3)' }}>
                  Step 5: Keystroke Flow Active
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Generative DSP Soundscape & Interactive Flow Canvas
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Master Volume Slider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--bg-surface-1)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <Sliders size={16} color="var(--text-muted)" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                style={{ width: '80px' }}
                title="Master Volume"
              />
              <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '32px' }}>
                {Math.round(masterVolume * 100)}%
              </span>
            </div>

            <button
              className="btn-secondary"
              onClick={() => alert('AI Focus Architect will be connected in Step 8!')}
            >
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span>AI Architect</span>
            </button>

            <button className="btn-primary" onClick={togglePlay}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Pause Soundscape' : 'Start Soundscape'}</span>
            </button>
          </div>
        </header>

        {/* Visual Theme & Keystroke Flow Bar */}
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-1)',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Visual Atmosphere:</span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['cosmic', 'cyberpunk', 'mandala', 'zen'] as VisualTheme[]).map((theme) => {
                const isSelected = visualTheme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => setVisualTheme(theme)}
                    style={{
                      background: isSelected ? 'var(--accent-cyan-glow)' : 'transparent',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keystroke / Flow State Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'hsla(222, 47%, 9%, 0.6)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.775rem'
            }}
          >
            <Keyboard size={14} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--text-secondary)' }}>Flow Typing Mode:</span>
            <span className="text-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              {keystrokeCount} strokes
            </span>
          </div>
        </div>

        {/* Section 1: Sound Channel Mixer Grid */}
        <section style={{ marginTop: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Headphones size={20} color="var(--accent-cyan)" />
                Generative Acoustic Mixer
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Infinite procedural audio generated mathematically in real-time. Zero audio files or network lag.
              </p>
            </div>
            <span className="brand-badge" style={{ borderColor: isPlaying ? 'var(--accent-emerald)' : 'var(--border-glass)', color: isPlaying ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
              {isPlaying ? '● DSP Engine Streaming' : '○ DSP Standby'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem'
            }}
          >
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="glass-card"
                style={{
                  border: channel.volume > 0 && !channel.muted && isPlaying
                    ? '1px solid hsla(199, 89%, 52%, 0.4)'
                    : '1px solid var(--border-glass)',
                  boxShadow: channel.volume > 0 && !channel.muted && isPlaying
                    ? '0 4px 20px hsla(199, 89%, 52%, 0.12)'
                    : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getChannelIcon(channel.id)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{channel.name}</h3>
                      <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {channel.muted ? 'Muted' : `${Math.round(channel.volume * 100)}%`}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => handleToggleMute(channel.id)}
                    title={channel.muted ? 'Unmute' : 'Mute'}
                  >
                    {channel.muted || channel.volume === 0 ? (
                      <VolumeX size={15} color="var(--text-muted)" />
                    ) : (
                      <Volume2 size={15} color="var(--accent-cyan)" />
                    )}
                  </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', minHeight: '34px' }}>
                  {channel.description}
                </p>

                {/* Volume Slider */}
                <div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={channel.muted ? 0 : channel.volume}
                    onChange={(e) => handleChannelVolume(channel.id, parseFloat(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Binaural Brainwave Entrainment Studio */}
        <BinauralPanel
          config={binauralConfig}
          isPlaying={isPlaying}
          onWaveTypeChange={handleWaveTypeChange}
          onBeatHzChange={handleBeatHzChange}
          onCarrierHzChange={handleCarrierHzChange}
          onVolumeChange={handleBinauralVolume}
          onToggleEnabled={handleToggleBinaural}
        />
      </main>
    </div>
  );
}
