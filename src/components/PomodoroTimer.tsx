import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Bell, Award, Plus, Minus } from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine.ts';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_CONFIG: Record<TimerMode, { label: string; defaultMinutes: number; color: string }> = {
  focus: { label: 'Focus Sprint', defaultMinutes: 25, color: 'var(--accent-cyan)' },
  shortBreak: { label: 'Short Rest', defaultMinutes: 5, color: 'var(--accent-emerald)' },
  longBreak: { label: 'Long Recovery', defaultMinutes: 15, color: 'var(--accent-indigo)' },
};

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const timerIntervalRef = useRef<number | null>(null);

  // Switch modes
  const handleSwitchMode = (newMode: TimerMode, customMins?: number) => {
    setIsRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    const mins = customMins ?? MODE_CONFIG[newMode].defaultMinutes;
    setMode(newMode);
    setDurationMinutes(mins);
    setRemainingSeconds(mins * 60);
  };

  // Adjust duration by delta minutes
  const handleAdjustMinutes = (delta: number) => {
    if (isRunning) return;
    const newMins = Math.max(1, Math.min(120, durationMinutes + delta));
    setDurationMinutes(newMins);
    setRemainingSeconds(newMins * 60);
  };

  // Toggle start / pause
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset current sprint
  const resetTimer = () => {
    setIsRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setRemainingSeconds(durationMinutes * 60);
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Sprint Complete!
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setIsRunning(false);

            // Trigger Harmonic Web Audio Bell Chime!
            audioEngine.playChime();

            if (mode === 'focus') {
              setCompletedSessions((c) => c + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning, mode]);

  // Format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circular Math
  const totalSeconds = durationMinutes * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

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
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--accent-cyan-glow)'
            }}
          >
            <Timer size={18} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem' }}>Deep Work Pomodoro Hub</h2>
              <span className="brand-badge" style={{ background: 'hsla(160, 84%, 44%, 0.15)', color: 'var(--accent-emerald)', borderColor: 'hsla(160, 84%, 44%, 0.3)' }}>
                Harmonic Alert
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Structured cognitive sprints with synthesized 528Hz Solfeggio acoustic bell
            </p>
          </div>
        </div>

        {/* Streak Counter & Test Chime */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-surface-1)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.8rem'
            }}
          >
            <Award size={14} color="var(--accent-amber)" />
            <span style={{ color: 'var(--text-secondary)' }}>Completed Sprints:</span>
            <span className="text-mono" style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
              {completedSessions}
            </span>
          </div>

          <button
            className="btn-secondary"
            onClick={() => audioEngine.playChime()}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            title="Preview synthesized Zen bell"
          >
            <Bell size={13} color="var(--accent-cyan)" />
            <span>Test Chime</span>
          </button>
        </div>
      </div>

      {/* Main Timer Display Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          background: 'var(--bg-surface-1)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)'
        }}
      >
        {/* Left: Visual Countdown Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="var(--bg-surface-2)"
              strokeWidth="8"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={MODE_CONFIG[mode].color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
                filter: isRunning ? `drop-shadow(0 0 8px ${MODE_CONFIG[mode].color})` : 'none'
              }}
            />
          </svg>

          {/* Centered Countdown Numbers */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              className="text-mono"
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}
            >
              {formatTime(remainingSeconds)}
            </span>
            <span
              style={{
                fontSize: '0.725rem',
                color: MODE_CONFIG[mode].color,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {MODE_CONFIG[mode].label}
            </span>
          </div>
        </div>

        {/* Right: Controls & Sprint Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface-2)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
            {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => {
              const isSelected = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => handleSwitchMode(m)}
                  style={{
                    flex: 1,
                    background: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                    border: isSelected ? `1px solid ${MODE_CONFIG[m].color}` : '1px solid transparent',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {MODE_CONFIG[m].label}
                </button>
              );
            })}
          </div>

          {/* Quick Sprint Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sprint Presets:</span>
            {[25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSwitchMode('focus', mins)}
                disabled={isRunning}
                style={{
                  background: durationMinutes === mins && mode === 'focus' ? 'var(--accent-cyan-glow)' : 'var(--bg-surface-2)',
                  border: durationMinutes === mins && mode === 'focus' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                  color: durationMinutes === mins && mode === 'focus' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem 0.55rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: isRunning ? 'not-allowed' : 'pointer'
                }}
              >
                {mins}m
              </button>
            ))}

            {/* Custom +5m / -5m Adjustment */}
            {!isRunning && (
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button
                  className="btn-icon"
                  style={{ width: '26px', height: '26px', borderRadius: '4px' }}
                  onClick={() => handleAdjustMinutes(-5)}
                  title="-5 Minutes"
                >
                  <Minus size={12} />
                </button>
                <button
                  className="btn-icon"
                  style={{ width: '26px', height: '26px', borderRadius: '4px' }}
                  onClick={() => handleAdjustMinutes(5)}
                  title="+5 Minutes"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            <button
              onClick={toggleTimer}
              className="btn-primary"
              style={{
                flex: 1,
                justifyContent: 'center',
                background: isRunning
                  ? 'linear-gradient(135deg, var(--accent-rose), hsl(346, 84%, 45%))'
                  : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))'
              }}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="btn-secondary"
              style={{ padding: '0.6rem 0.9rem' }}
              title="Reset Timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
