import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Key,
  Quote,
  ListTodo,
  ExternalLink,
  Play
} from 'lucide-react';
import { AIPlanResponse } from '../types/index.ts';
import { generateFocusPlan, getStoredApiKey, saveStoredApiKey } from '../services/geminiService.ts';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: AIPlanResponse) => void;
}

const QUICK_PROMPTS = [
  'Late night LeetCode Dynamic Programming & Graph DSA grind',
  'Studying for LNMIIT Operating Systems & DBMS mid-term exam',
  'Writing a comprehensive research report and technical documentation',
  'Deep creative system architecture design & UI wireframing'
];

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onApplyPlan }) => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Analyzing cognitive load...');
  const [resultPlan, setResultPlan] = useState<AIPlanResponse | null>(null);
  const [completedGoals, setCompletedGoals] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    saveStoredApiKey(key);
  };

  const handleGenerate = async (targetPrompt?: string) => {
    const textToUse = targetPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsLoading(true);
    setResultPlan(null);
    setCompletedGoals({});

    // Dynamic loading steps
    setLoadingStep('Consulting Google Gemini 2.0 Flash...');
    const t1 = setTimeout(() => setLoadingStep('Synthesizing brainwave entrainment harmonics...'), 400);
    const t2 = setTimeout(() => setLoadingStep('Balancing procedural acoustic noise filters...'), 900);

    try {
      const plan = await generateFocusPlan(textToUse, apiKey);
      setResultPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
    }
  };

  const toggleGoal = (index: number) => {
    setCompletedGoals((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleApply = () => {
    if (resultPlan) {
      onApplyPlan(resultPlan);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'hsla(222, 47%, 4%, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-glass-card)',
          border: '1px solid var(--accent-cyan-glow)',
          boxShadow: '0 16px 50px hsla(199, 89%, 52%, 0.2)',
          padding: '1.75rem',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px var(--accent-cyan-glow)'
              }}
            >
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Gemini AI Focus Architect</h2>
                <span className="brand-badge" style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)' }}>
                  Gemini 2.0 Flash
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tell the AI what you're working on — it customizes your entire soundscape, timer, & brainwave regimen
              </p>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* API Key Toggle Drawer */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            style={{
              background: 'transparent',
              color: apiKey ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.2rem 0'
            }}
          >
            <Key size={13} />
            <span>{apiKey ? '✓ Gemini API Key Active' : '+ Optional: Add Google AI Studio Gemini API Key'}</span>
          </button>

          {showKeyInput && (
            <div
              style={{
                marginTop: '0.5rem',
                background: 'var(--bg-surface-1)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="password"
                  placeholder="Paste Gemini API Key (AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-glass)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Don't have a key? Get one free at{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                >
                  Google AI Studio <ExternalLink size={10} />
                </a>
                . (If left blank, BeatFlow uses its built-in offline smart engine!)
              </span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Quick Focus Templates:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(q);
                  handleGenerate(q);
                }}
                disabled={isLoading}
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.7rem',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="e.g. Grinding LeetCode graph algorithms for 45 minutes with rain..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !prompt.trim()}
            className="btn-primary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            <span>{isLoading ? 'Designing...' : 'Architect'}</span>
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div
            style={{
              background: 'var(--bg-surface-1)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-cyan-glow)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid var(--accent-cyan-glow)',
                borderTopColor: 'var(--accent-cyan)',
                animation: 'spin 1s linear infinite'
              }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
              {loadingStep}
            </span>
          </div>
        )}

        {/* AI Result Card */}
        {resultPlan && !isLoading && (
          <div
            style={{
              background: 'var(--bg-surface-1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-cyan)',
              boxShadow: '0 8px 30px var(--accent-cyan-glow)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            {/* Title & Sprint Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  Recommended Focus Protocol:
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {resultPlan.sessionName}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="brand-badge" style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)' }}>
                  ⏱️ {resultPlan.recommendedDurationMinutes} Mins
                </span>
                <span className="brand-badge" style={{ background: 'var(--accent-indigo-glow)', color: 'var(--accent-indigo)' }}>
                  ⚡ {resultPlan.binaural.beatHz}Hz {resultPlan.binaural.targetWave.toUpperCase()}
                </span>
                <span className="brand-badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>
                  🎨 {resultPlan.visualTheme}
                </span>
              </div>
            </div>

            {/* Motivational Quote */}
            <div
              style={{
                background: 'hsla(222, 47%, 9%, 0.6)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Quote size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                "{resultPlan.focusQuote}"
              </p>
            </div>

            {/* Micro-Goals Checklist */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ListTodo size={15} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  3-Step Sprint Micro-Goals:
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {resultPlan.microGoals.map((goal, idx) => {
                  const isChecked = !!completedGoals[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleGoal(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        background: isChecked ? 'hsla(160, 84%, 44%, 0.1)' : 'var(--bg-surface-2)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        color={isChecked ? 'var(--accent-emerald)' : 'var(--text-muted)'}
                      />
                      <span
                        style={{
                          fontSize: '0.825rem',
                          color: isChecked ? 'var(--accent-emerald)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none'
                        }}
                      >
                        {goal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Sprint Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleApply}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  fontSize: '0.95rem'
                }}
              >
                <Play size={18} />
                <span>Apply Regimen & Launch Focus Sprint</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
