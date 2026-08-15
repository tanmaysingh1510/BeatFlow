import { VisualTheme } from '../types/index.ts';

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  color: string;
  lineWidth: number;
}

export interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class ShockwaveEngine {
  private shockwaves: Shockwave[] = [];
  private sparks: SparkParticle[] = [];

  /**
   * Triggers an expanding shockwave and burst of spark particles on keystroke
   */
  public triggerKeystroke(
    width: number,
    height: number,
    theme: VisualTheme,
    customX?: number,
    customY?: number
  ): void {
    // If no coordinates provided, spawn shockwave from dynamic random origin near center
    const x = customX ?? width / 2 + (Math.random() - 0.5) * (width * 0.5);
    const y = customY ?? height / 2 + (Math.random() - 0.5) * (height * 0.4);

    const color = this.getShockwaveColor(theme);

    // 1. Create Expanding Ring Shockwave
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.min(width, height) * 0.45,
      alpha: 0.85,
      speed: Math.random() * 4 + 6,
      color,
      lineWidth: Math.random() * 2 + 1.5
    });

    // 2. Create Kinetic Spark Burst (12-18 particles)
    const sparkCount = 14;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 5 + 2;
      const maxLife = Math.floor(Math.random() * 25 + 20);

      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        life: 0,
        maxLife,
        color,
        size: Math.random() * 2.5 + 1.5
      });
    }

    // Limit maximum concurrent shockwaves for optimal performance
    if (this.shockwaves.length > 25) {
      this.shockwaves.splice(0, this.shockwaves.length - 25);
    }
    if (this.sparks.length > 200) {
      this.sparks.splice(0, this.sparks.length - 200);
    }
  }

  /**
   * Triggers an interactive ripple on mouse click or pointer tap
   */
  public triggerClick(x: number, y: number, theme: VisualTheme): void {
    const color = this.getShockwaveColor(theme);
    this.shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius: 280,
      alpha: 0.9,
      speed: 7,
      color,
      lineWidth: 2.5
    });
  }

  private getShockwaveColor(theme: VisualTheme): string {
    switch (theme) {
      case 'cyberpunk': {
        const hues = [320, 190, 280]; // Neon Pink, Cyan, Purple
        const h = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${h}, 100%, 65%)`;
      }
      case 'mandala': {
        const hues = [38, 160, 199]; // Gold, Emerald, Cyan
        const h = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${h}, 95%, 65%)`;
      }
      case 'zen': {
        return `hsl(210, 30%, 85%)`; // Ethereal silver glow
      }
      case 'cosmic':
      default: {
        const hues = [199, 245, 170]; // Cyan, Electric Indigo, Mint
        const h = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${h}, 90%, 65%)`;
      }
    }
  }

  /**
   * Updates physics and draws shockwaves and sparks onto the canvas
   */
  public updateAndDraw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Update & Render Expanding Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];

      sw.radius += sw.speed;
      const progress = sw.radius / sw.maxRadius;
      sw.alpha = Math.max(0, (1 - progress * progress) * 0.8);

      if (progress >= 1 || sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = sw.lineWidth * (1 - progress * 0.5);
      ctx.globalAlpha = sw.alpha;
      ctx.stroke();
    }

    // 2. Update & Render Kinetic Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];

      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.94; // Air resistance friction
      sp.vy *= 0.94;
      sp.life++;

      const lifeProgress = sp.life / sp.maxLife;
      sp.alpha = Math.max(0, 1 - lifeProgress);

      if (sp.life >= sp.maxLife || sp.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * (1 - lifeProgress * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = sp.alpha;
      ctx.fill();
    }

    ctx.restore();
  }
}
