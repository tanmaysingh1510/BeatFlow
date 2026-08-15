import React, { useState } from 'react';
import { Bookmark, Sparkles, Plus, Trash2, Check } from 'lucide-react';
import { SoundscapePreset, SoundChannel, BinauralConfig, VisualTheme } from '../types/index.ts';
import { DEFAULT_PRESETS, loadCustomPresets, saveCustomPreset, deleteCustomPreset } from '../data/presets.ts';

interface PresetSelectorProps {
  currentPresetId: string | null;
  currentChannels: SoundChannel[];
  currentBinaural: BinauralConfig;
  currentTheme: VisualTheme;
  onSelectPreset: (preset: SoundscapePreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  currentChannels,
  currentBinaural,
  currentTheme,
  onSelectPreset,
}) => {
  const [customPresets, setCustomPresets] = useState<SoundscapePreset[]>(() => loadCustomPresets());
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const channelMap: Partial<Record<string, number>> = {};
    currentChannels.forEach((ch) => {
      channelMap[ch.id] = ch.muted ? 0 : ch.volume;
    });

    const newPreset: SoundscapePreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || 'Custom user crafted acoustic soundscape mix.',
      channels: channelMap,
      binaural: { ...currentBinaural },
      visualTheme: currentTheme
    };

    const updated = saveCustomPreset(newPreset);
    setCustomPresets(updated);
    setIsCreating(false);
    setNewPresetName('');
    setNewPresetDesc('');
    onSelectPreset(newPreset);
  };

  const handleDeleteCustom = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    const updated = deleteCustomPreset(presetId);
    setCustomPresets(updated);
  };

  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        marginTop: '1.75rem',
        background: 'var(--bg-glass-card)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--accent-cyan-glow)'
            }}
          >
            <Bookmark size={18} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem' }}>Curated Focus Soundscapes</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Hand-tuned acoustic environments configured for specific mental states
            </p>
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={() => setIsCreating(!isCreating)}
          style={{ fontSize: '0.8rem' }}
        >
          <Plus size={15} color="var(--accent-cyan)" />
          <span>{isCreating ? 'Cancel' : 'Save Current Mix'}</span>
        </button>
      </div>

      {/* Inline Custom Preset Creator Form */}
      {isCreating && (
        <form
          onSubmit={handleSaveCustom}
          style={{
            background: 'var(--bg-surface-1)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent-cyan-glow)',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            <Sparkles size={16} />
            <span>Save Current Audio Faders & Theme as Custom Preset</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Preset Name (e.g. My Late Night Focus)"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              required
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-glass)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={newPresetDesc}
              onChange={(e) => setNewPresetDesc(e.target.value)}
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-glass)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            >
              <Check size={14} />
              <span>Save Preset</span>
            </button>
          </div>
        </form>
      )}

      {/* Preset Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}
      >
        {allPresets.map((preset) => {
          const isSelected = currentPresetId === preset.id;
          const isCustom = preset.id.startsWith('custom-');

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              style={{
                background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface-1)',
                border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: isSelected ? '0 4px 20px var(--accent-cyan-glow)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                    {preset.name}
                  </h3>

                  {isCustom && (
                    <button
                      className="btn-icon"
                      style={{ width: '24px', height: '24px', padding: 0 }}
                      onClick={(e) => handleDeleteCustom(e, preset.id)}
                      title="Delete Custom Preset"
                    >
                      <Trash2 size={12} color="var(--accent-rose)" />
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                  {preset.description}
                </p>
              </div>

              {/* Badges for Brainwave & Atmosphere */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
                {preset.binaural?.waveType && (
                  <span className="brand-badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                    {preset.binaural.beatHz}Hz {preset.binaural.waveType.toUpperCase()}
                  </span>
                )}
                <span
                  className="brand-badge"
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.45rem',
                    background: 'var(--bg-surface-2)',
                    borderColor: 'var(--border-glass)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {preset.visualTheme}
                </span>
                {isSelected && (
                  <span
                    className="brand-badge"
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.15rem 0.45rem',
                      background: 'var(--accent-cyan)',
                      color: '#000',
                      fontWeight: 700
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
