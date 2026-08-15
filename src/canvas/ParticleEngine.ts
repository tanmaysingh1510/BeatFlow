import { VisualTheme } from '../types/index.ts';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  angle: number;
  speed: number;
  distance: number;
}

export class ParticleEngine {
  private particles: Particle[] = [];
  private width: number = 0;
  private height: number = 0;
  private theme: VisualTheme = 'cosmic';

  private mouseX: number = 0;
  private mouseY: number = 0;
  private isMouseActive: boolean = false;

  constructor(width: number, height: number, theme: VisualTheme = 'cosmic') {
    this.resize(width, height);
    this.theme = theme;
    this.initParticles();
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public setTheme(theme: VisualTheme): void {
    this.theme = theme;
    this.initParticles();
  }

  public setMousePos(x: number, y: number, active: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
    this.isMouseActive = active;
  }

  public initParticles(): void {
    this.particles = [];
    const count = this.getParticleCount();

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private getParticleCount(): number {
    switch (this.theme) {
      case 'cosmic': return 160;
      case 'cyberpunk': return 120;
      case 'mandala': return 180;
      case 'zen': return 70;
      default: return 120;
    }
  }

  private createParticle(): Particle {
    const angle = Math.random() * Math.PI * 2;
    const maxDist = Math.hypot(this.width / 2, this.height / 2);
    const distance = Math.random() * maxDist;

    const baseRadius = Math.random() * 2.5 + 1.2;
    const baseAlpha = Math.random() * 0.6 + 0.2;

    return {
      x: this.width / 2 + Math.cos(angle) * distance,
      y: this.height / 2 + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      baseRadius,
      radius: baseRadius,
      color: this.getThemeColor(),
      alpha: baseAlpha,
      baseAlpha,
      angle,
      speed: Math.random() * 0.003 + 0.001,
      distance
    };
  }

  private getThemeColor(): string {
    switch (this.theme) {
      case 'cosmic': {
        const hues = [199, 210, 245, 280]; // Cyan, Sky, Indigo, Purple
        const h = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${h}, 85%, 65%)`;
      }
      case 'cyberpunk': {
        const hues = [190, 320, 280]; // Electric Cyan, Neon Magenta, Violet
        const h = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${h}, 95%, 60%)`;
      }
      case 'mandala': {
        const hues = [38, 160, 199, 245]; // Gold, Emerald, Cyan, Indigo
        const h = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${h}, 90%, 65%)`;
      }
      case 'zen': {
        return `hsl(215, 25%, 80%)`; // Clean minimalist silver mist
      }
      default:
        return `hsl(199, 89%, 60%)`;
    }
  }

  /**
   * Updates and draws particles modulated by audio frequency energy & cursor physics
   */
  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    frequencyData: Uint8Array | null,
    isPlaying: boolean
  ): void {
    // 1. Calculate frequency bands (Bass, Mid, Treble)
    let bass = 0;
    let mid = 0;
    let treble = 0;

    if (frequencyData && frequencyData.length > 0 && isPlaying) {
      // Bass: bins 0 - 8 (~0 to 300Hz)
      for (let i = 0; i < 8; i++) bass += frequencyData[i];
      bass = bass / 8 / 255; // Normalized 0.0 to 1.0

      // Mid: bins 9 - 35 (~300Hz to 2.5kHz)
      for (let i = 9; i < 35; i++) mid += frequencyData[i];
      mid = mid / 26 / 255;

      // Treble: bins 36 - 90 (~2.5kHz to 8kHz)
      for (let i = 36; i < 90; i++) treble += frequencyData[i];
      treble = treble / 54 / 255;
    }

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Use additive blending for glowing nebula effect
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 2. Render Core Audio Wave Halo in the Center
    if (isPlaying && (bass > 0.05 || mid > 0.05)) {
      const haloRadius = (80 + bass * 120);
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, haloRadius
      );

      const color = this.theme === 'cyberpunk'
        ? 'hsla(320, 95%, 60%,'
        : 'hsla(199, 89%, 55%,';

      gradient.addColorStop(0, `${color} ${0.25 * (bass + 0.1)})`);
      gradient.addColorStop(0.5, `${color} ${0.1 * (mid + 0.05)})`);
      gradient.addColorStop(1, `${color} 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, haloRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Render and Update Each Particle
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Swirl / Orbit dynamics
      p.angle += p.speed * (1 + mid * 3);
      const audioPulse = bass * 1.8 + treble * 0.8;
      
      // Update coordinates
      if (this.theme === 'mandala') {
        // Radial symmetric petal motion
        const dist = p.distance + Math.sin(p.angle * 6) * (20 + bass * 40);
        p.x = centerX + Math.cos(p.angle) * dist;
        p.y = centerY + Math.sin(p.angle) * dist;
      } else {
        // Organic cosmic drift
        p.x += p.vx * (1 + bass * 2);
        p.y += p.vy * (1 + bass * 2);

        // Mouse Gravitational Repulsion Physics
        if (this.isMouseActive) {
          const dx = p.x - this.mouseX;
          const dy = p.y - this.mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 1) {
            const force = (1 - dist / 120) * 2.5;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Screen boundary wrap
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;
      }

      // Audio-reactive size and luminescence
      p.radius = p.baseRadius * (1 + audioPulse * 2.2);
      p.alpha = Math.min(1.0, p.baseAlpha + audioPulse * 0.5);

      // Draw glowing particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Draw subtle connecting constellation lines for cosmic & zen themes
      if ((this.theme === 'cosmic' || this.theme === 'zen') && i % 3 === 0) {
        for (let j = i + 1; j < Math.min(i + 6, this.particles.length); j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 90) * 0.15 * (1 + mid);
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    }

    ctx.restore();
  }
}
