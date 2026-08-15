# Product Requirements Document (PRD)

## Project Name: BeatFlow
**Subtitle:** AI-Powered Generative Focus Soundscape & Audio-Reactive Particle Sandbox  
**Author:** Tanmay (LNMIIT Jaipur) & Antigravity Lead Architect  
**Status:** Approved / Ready for Implementation  
**Version:** 1.0.0  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
Students, competitive programmers, and knowledge workers face severe focus disruption due to cognitive fatigue and ambient noise. Existing solutions have critical flaws:
* **Streaming Services (Spotify/YouTube Lo-Fi):** Passive, contain distracting melodic hooks, consume high network bandwidth, and include intrusive ads.
* **Basic White Noise Apps (Noisli, A Soft Murmur):** Rely on short, static MP3 audio loops where the listener's brain quickly detects loop seams. They lack visual stimulation, session intelligence, and developer interaction.

### 1.2 The Solution
**BeatFlow** is an open-source, ultra-low-latency web application that synthesizes mathematical ambient soundscapes and true binaural brainwave frequencies directly in the browser. It pairs this generative audio with a 60 FPS audio-reactive particle canvas (with interactive keystroke ripples) and an AI "Focus Architect" powered by the Gemini API that generates personalized acoustic environments and study regimens based on natural language prompts.

---

## 2. Target Audience & User Personas

1. **The CS Student / Competitive Programmer (Primary):** Grinding LeetCode, DSA, or debugging complex code for hours; needs uninterrupted flow state and satisfying tactile feedback.
2. **The Hackathon Hustler:** Working in noisy event venues on tight deadlines; needs rapid deep-work sprints and personalized motivation.
3. **The Deep Work Knowledge Worker / Researcher:** Reading dense research papers or drafting technical documentation; requires specific brainwave entrainment (Alpha/Theta) to stay calm and focused.

---

## 3. Core Value Propositions & Key Differentiators

| Feature | Generic Audio Apps | BeatFlow |
| :--- | :--- | :--- |
| **Audio Engine** | Pre-recorded MP3 loops (repetitive) | Algorithmic Web Audio API synthesis (infinite, no seams) |
| **Binaural Beats** | Static pre-rendered stereo tracks | Mathematically computed dual-oscillator frequencies (Delta, Theta, Alpha, Beta, Gamma) |
| **Visual Feedback** | Static background image or GIF | 60 FPS real-time Fast Fourier Transform (FFT) particle physics + typing ripples |
| **AI Intelligence** | None (manual slider adjustment) | Gemini API "Focus Architect" (Natural language -> soundscape preset + session goals) |
| **Footprint & Cost** | Heavy downloads, subscription models | Zero-install, 100% free, runs offline as a lightweight PWA |

---

## 4. Functional Requirements (FR)

### 4.1 Generative Audio Synthesizer (DSP Engine)
* **FR 1.1 - Procedural Noise Generators:** Synthesize real-time Pink Noise, Brown Noise, and White Noise using JavaScript audio buffers without any external audio files.
* **FR 1.2 - Natural Elements Synthesizers:**
  * *Rainfall & Storm:* Procedural randomized bandpass-filtered noise with intermittent randomized thunder bursts.
  * *Fireplace Crackle:* Low-frequency rumble paired with Poisson-distributed micro-burst crackles.
  * *Deep Space Drone:* Modulated resonant sine and sawtooth sub-bass waves.
  * *Wind & Waves:* Low-frequency oscillators (LFO) modulating cutoff filters to simulate rolling ocean waves.
* **FR 1.3 - True Binaural Beat Engine:**
  * Carrier frequency slider (100 Hz – 400 Hz).
  * Brainwave entrainment selector:
    * **Delta (0.5 – 4 Hz):** Deep sleep and recovery.
    * **Theta (4 – 8 Hz):** Deep meditation and creative intuition.
    * **Alpha (8 – 14 Hz):** Relaxed alertness and reading focus.
    * **Beta (14 – 30 Hz):** Active thinking, problem solving, and writing.
    * **Gamma (30 – 50 Hz):** Peak cognition, competitive programming, and high-intensity debugging.
  * Independent Left/Right stereo panning nodes (`StereoPannerNode`).
* **FR 1.4 - Master Audio Controls:** Global volume, individual channel volume sliders, mute toggles, and master equalizer presets.

### 4.2 Audio-Reactive & Keystroke-Interactive Canvas (60 FPS)
* **FR 2.1 - Real-Time FFT Spectrum Analysis:** Use `AnalyserNode` to extract instantaneous frequency data across bass, mid, and treble bands.
* **FR 2.2 - Particle Physics Simulation:**
  * Hundreds of dynamic particles responding to audio energy (particle velocity, size, and hue modulate with bass and treble intensity).
  * Multiple visual presets: *Cosmic Nebula*, *Cyberpunk Grid*, *Sacred Geometry / Mandala*, and *Zen Minimalist*.
* **FR 2.3 - Keystroke & Mouse Interactivity ("Flow Mode"):**
  * Listening to keyboard events (`keydown`) to fire shockwaves, particle bursts, and ripple effects across the canvas.
  * Cursor gravity/repulsion physics on mouse movement.

### 4.3 Gemini-Powered "AI Focus Architect"
* **FR 3.1 - Natural Language Session Prompting:** User inputs a statement (e.g., *"I have 60 minutes to study Graph Algorithms for my LNMIIT exam and my mind is wandering"*).
* **FR 3.2 - Intelligent Parameter Mapping:** Gemini API parses intent and returns structured JSON:
  * Optimal audio channel gains (Rain: 0.6, Binaural: Gamma 40Hz, Drone: 0.3, Fire: 0.2).
  * Recommended visual preset and color temperature.
  * Sprint duration & Pomodoro interval.
  * Custom motivational focus quote and a 3-step micro-task checklist.
* **FR 3.3 - Offline / Fallback Mode:** Pre-configured rule-based presets when offline or without an API key.

### 4.4 Deep Work Suite & Session Tracking
* **FR 4.1 - Smart Pomodoro Timer:** Configurable work/break intervals, smooth visual countdown ring, gentle synthesized sound chime at interval completion.
* **FR 4.2 - Ambient Soundscape Presets & Sharing:**
  * Built-in one-click presets (*Midnight Hacker*, *Monsoon Coffee Shop*, *Deep Space Odyssey*, *Zen Temple*).
  * Custom preset creation saved to `LocalStorage`.
  * **Shareable URL Hash:** Encode soundscape settings in URL query parameters for instant one-click sharing with peers.

---

## 5. Non-Functional Requirements (NFR)

* **Performance:** 
  * Stable 60 FPS animation loop via `requestAnimationFrame`.
  * Audio buffer calculation without UI thread blocking (AudioWorklet or optimized typed arrays).
  * Total initial bundle size < 250 KB (blazing fast load under 1 second).
* **Cross-Browser & Device Compatibility:** Fully responsive layout for desktop (ideal for IDE side-by-side) and mobile viewports. Full support for modern Chrome, Firefox, Edge, and Safari.
* **Privacy & Security:** 100% client-side audio synthesis. Zero recording or transmission of user keystrokes. API keys stored strictly in client local storage / environment variables.
* **Accessibility:** High-contrast dark theme, keyboard navigability for sound controls, and reduced-motion toggle for the canvas visualizer.

---

## 6. Success Metrics for LinkedIn & Hackathons

1. **Demo Polish:** Instant visual and acoustic gratification within 5 seconds of opening the site.
2. **Technical Depth:** Demonstrated mastery of Web Audio API, Fast Fourier Transforms, HTML5 Canvas math, and Gemini Structured Outputs.
3. **Shareability:** Working live deployed link on Vercel/Netlify with one-click URL soundscape sharing.
4. **Clean Code & Documentation:** Comprehensive GitHub `README.md` with demo GIF, architectural breakdown, and quick-start instructions.
