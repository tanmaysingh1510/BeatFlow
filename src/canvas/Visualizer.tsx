import React, { useEffect, useRef } from 'react';
import { VisualTheme } from '../types/index.ts';
import { ParticleEngine } from './ParticleEngine.ts';
import { ShockwaveEngine } from './ShockwaveEngine.ts';
import { audioEngine } from '../audio/AudioEngine.ts';

interface VisualizerProps {
  theme: VisualTheme;
  isPlaying: boolean;
  onKeystroke?: () => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({ theme, isPlaying, onKeystroke }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleEngineRef = useRef<ParticleEngine | null>(null);
  const shockwaveEngineRef = useRef<ShockwaveEngine>(new ShockwaveEngine());
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Handle HiDPI / Retina Crisp Resolution
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      if (!particleEngineRef.current) {
        particleEngineRef.current = new ParticleEngine(width, height, theme);
      } else {
        particleEngineRef.current.resize(width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 1. Interactive Keystroke Shockwaves
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const width = window.innerWidth;
      const height = window.innerHeight;
      shockwaveEngineRef.current.triggerKeystroke(width, height, theme);
      if (onKeystroke) {
        onKeystroke();
      }
    };

    // 2. Mouse / Pointer Interactivity
    const handlePointerMove = (e: PointerEvent) => {
      if (particleEngineRef.current) {
        particleEngineRef.current.setMousePos(e.clientX, e.clientY, true);
      }
    };

    const handlePointerLeave = () => {
      if (particleEngineRef.current) {
        particleEngineRef.current.setMousePos(0, 0, false);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (['BUTTON', 'INPUT', 'A'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      shockwaveEngineRef.current.triggerClick(e.clientX, e.clientY, theme);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown);

    // Frequency buffer array for FFT
    const freqData = new Uint8Array(128);

    // 60 FPS Render Loop
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Draw Deep Obsidian Background with soft trail fade
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) / 1.2
      );

      if (theme === 'cyberpunk') {
        bgGradient.addColorStop(0, 'hsl(260, 45%, 8%)');
        bgGradient.addColorStop(1, 'hsl(222, 47%, 4%)');
      } else if (theme === 'mandala') {
        bgGradient.addColorStop(0, 'hsl(220, 40%, 9%)');
        bgGradient.addColorStop(1, 'hsl(222, 47%, 4%)');
      } else {
        bgGradient.addColorStop(0, 'hsl(222, 45%, 9%)');
        bgGradient.addColorStop(1, 'hsl(222, 47%, 5%)');
      }

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Fetch real-time FFT spectrum from Web Audio Engine
      const analyser = audioEngine.getAnalyser();
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(freqData);
      }

      // 1. Render Audio-Reactive Particles
      if (particleEngineRef.current) {
        particleEngineRef.current.updateAndDraw(ctx, isPlaying ? freqData : null, isPlaying);
      }

      // 2. Render Interactive Keystroke Shockwaves & Sparks
      shockwaveEngineRef.current.updateAndDraw(ctx);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme, isPlaying, onKeystroke]);

  // Update theme when prop changes
  useEffect(() => {
    if (particleEngineRef.current) {
      particleEngineRef.current.setTheme(theme);
    }
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-background"
      style={{ display: 'block' }}
    />
  );
};
