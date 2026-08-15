import React from 'react';
import { Activity, Radio, Volume2, Headphones } from 'lucide-react';
import { BrainwaveType, BinauralConfig } from '../types/index.ts';
import { BRAINWAVE_PRESETS } from '../audio/BinauralBeat.ts';

interface BinauralPanelProps {
  config: BinauralConfig;
  isPlaying: boolean;
  onWaveTypeChange: (type: BrainwaveType) => void;
  onBeatHzChange: (hz: number) => void;
  onCarrierHzChange: (hz: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleEnabled: (enabled: boolean) => void;
}

export const BinauralPanel: React.FC<BinauralPanelProps> = ({
  config,
  isPlaying,
  onWaveTypeChange,
  onBeatHzChange,
  onCarrierHzChange,
  onVolumeChange,
  onToggleEnabled,
}) => {
  const currentPreset = BRAINWAVE_PRESETS[config.waveType];
  const leftFreq = config.carrierHz;
  const rightFreq = Math.round((config.carrierHz + config.beatHz) * 10) / 10;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        marginTop: '1.5rem',
        border: config.enabled && isPlaying ? '1px solid hsla(245, 82%, 67%, 0.4)' : '1px solid var(--border-glass)',
        boxShadow: config.enabled && isPlaying ? '0 8px 30px hsla(245, 82%, 67%, 0.15)' : 'var(--shadow-md)',
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* Header with Title & Enable Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-indigo), hsl(280, 80%, 65%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--accent-indigo-glow)'
            }}
          >
            <Activity size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem' }}>Binaural Brainwave Entrainment</h2>
              <span className="brand-badge" style={{ background: 'var(--accent-indigo-glow)', color: 'var(--accent-indigo)', borderColor: 'hsla(245, 82%, 67%, 0.3)' }}>
                Stereo DSP
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dual-frequency sine oscillators designed for deep cognitive entrainment
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onToggleEnabled(!config.enabled)}
            className="btn-secondary"
            style={{
              background: config.enabled ? 'var(--accent-indigo-glow)' : 'var(--bg-surface-1)',
              borderColor: config.enabled ? 'var(--accent-indigo)' : 'var(--border-glass)',
              color: config.enabled ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.8rem'
            }}
          >
            <Radio size={14} color={config.enabled ? 'var(--accent-indigo)' : 'var(--text-muted)'} />
            <span>{config.enabled ? 'Binaural Active' : 'Binaural Disabled'}</span>
          </button>
        </div>
      </div>

      {/* Brainwave Selector Pill Group */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.6rem',
          marginBottom: '1.25rem'
        }}
      >
        {(Object.keys(BRAINWAVE_PRESETS) as BrainwaveType[]).map((type) => {
          const preset = BRAINWAVE_PRESETS[type];
          const isSelected = config.waveType === type;
          return (
            <button
              key={type}
              onClick={() => onWaveTypeChange(type)}
              style={{
                background: isSelected ? 'var(--accent-indigo-glow)' : 'var(--bg-surface-1)',
                border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.8rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {preset.name}
                </span>
                <span className="text-mono" style={{ fontSize: '0.7rem', color: isSelected ? 'var(--accent-indigo)' : 'var(--text-muted)' }}>
                  {preset.defaultHz} Hz
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {preset.range}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Brainwave Description & Stereo Frequency Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-surface-1)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-indigo)', fontWeight: 600 }}>
            {currentPreset.name} Wave Intent:
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {currentPreset.description}
          </p>
          <p style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)', marginTop: '0.3rem' }}>
            🎯 <strong>Ideal for:</strong> {currentPreset.idealFor}
          </p>
        </div>

        {/* Live Stereo Frequencies */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Left Ear Carrier:</span>
            <span className="text-mono" style={{ color: 'var(--text-primary)' }}>{leftFreq} Hz</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Right Ear Carrier:</span>
            <span className="text-mono" style={{ color: 'var(--text-primary)' }}>{rightFreq} Hz</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.3rem', borderTop: '1px solid var(--border-glass)' }}>
            <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>Perceived Brainwave (Δ):</span>
            <span className="text-mono" style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>{config.beatHz} Hz ({currentPreset.name})</span>
          </div>
        </div>
      </div>

      {/* Sliders: Volume & Carrier Tuning */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Volume2 size={14} color="var(--accent-indigo)" />
              Binaural Volume
            </span>
            <span className="text-mono" style={{ color: 'var(--text-muted)' }}>{Math.round(config.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Carrier Frequency (Warmth)</span>
            <span className="text-mono" style={{ color: 'var(--text-muted)' }}>{config.carrierHz} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="350"
            step="1"
            value={config.carrierHz}
            onChange={(e) => onCarrierHzChange(parseInt(e.target.value, 10))}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Custom Beat Delta (Δf)</span>
            <span className="text-mono" style={{ color: 'var(--text-muted)' }}>{config.beatHz} Hz</span>
          </div>
          <input
            type="range"
            min="1"
            max="45"
            step="0.5"
            value={config.beatHz}
            onChange={(e) => onBeatHzChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* Educational Note */}
      <div
        style={{
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'hsla(222, 47%, 9%, 0.5)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-glass)'
        }}
      >
        <Headphones size={15} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Stereo Headphones Required:</strong> Binaural beats rely on physical acoustic isolation. Your left and right ears must receive slightly different frequencies for your brainstem's superior olivary complex to synthesize the perceived beat.
        </span>
      </div>
    </div>
  );
};
