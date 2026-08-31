export interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface TrailPoint {
  x: number;
  y: number;
  width: number;
  alpha: number;
  time: number;
}

export class InkCursor {
  public screenX: number = -100;
  public screenY: number = -100;
  public worldX: number = 0;
  public worldY: number = 0;

  private lastX: number = -100;
  private lastY: number = -100;
  private velocity: number = 0;

  private trail: TrailPoint[] = [];
  private particles: InkParticle[] = [];
  public isHovering: boolean = false;
  public isDragging: boolean = false;
  public hoverLabel: string = '';

  private readonly maxTrailLength = 40;
  private readonly cobaltInk = 'rgba(0, 56, 168, '; // #0038A8
  private readonly cyanotypeInk = 'rgba(22, 37, 61, '; // #16253D
  private readonly vermilionInk = 'rgba(224, 62, 45, '; // #E03E2D

  constructor() {}

  public setPosition(screenX: number, screenY: number, worldX: number, worldY: number) {
    const dx = screenX - this.lastX;
    const dy = screenY - this.lastY;
    const dist = Math.hypot(dx, dy);

    this.velocity = dist;
    this.screenX = screenX;
    this.screenY = screenY;
    this.worldX = worldX;
    this.worldY = worldY;

    if (this.lastX > 0 && this.lastY > 0 && dist > 1.5) {
      // Calculate dynamic stroke width inversely proportional to velocity
      const dynamicWidth = Math.max(1.2, Math.min(8, 20 / (dist * 0.3 + 1)));
      
      this.trail.unshift({
        x: screenX,
        y: screenY,
        width: dynamicWidth,
        alpha: 0.85,
        time: performance.now()
      });

      if (this.trail.length > this.maxTrailLength) {
        this.trail.pop();
      }

      // Emit subtle ink spatter droplets when moving quickly
      if (dist > 8 && Math.random() < 0.35) {
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
        const speed = Math.random() * 2 + 0.5;
        this.particles.push({
          x: screenX + (Math.random() - 0.5) * 6,
          y: screenY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.2 + 0.8,
          alpha: 0.7,
          life: 1.0,
          maxLife: Math.random() * 400 + 300,
          color: Math.random() < 0.85 ? this.cobaltInk : this.cyanotypeInk
        });
      }
    }

    this.lastX = screenX;
    this.lastY = screenY;
  }

  public update(dt: number) {
    const now = performance.now();

    // Fade trail points
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      const age = now - p.time;
      if (age > 600) {
        this.trail.splice(i, 1);
      } else {
        p.alpha = Math.max(0, 0.85 * (1 - age / 600));
      }
    }

    // Update and prune particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vx *= 0.94;
      pt.vy *= 0.94;
      pt.life -= (dt * 1000) / pt.maxLife;

      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.screenX < 0 || this.screenY < 0) return;

    // 1. Draw smooth fluid ink trail ribbon
    if (this.trail.length > 2) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = this.trail[i];
        const p2 = this.trail[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = p1.width;
        ctx.strokeStyle = `${this.cobaltInk}${p1.alpha.toFixed(3)})`;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Draw ink spatter droplets
    if (this.particles.length > 0) {
      ctx.save();
      for (const pt of this.particles) {
        ctx.fillStyle = `${pt.color}${Math.max(0, pt.alpha * pt.life).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Draw sensitive technical reticle cursor
    ctx.save();
    const x = this.screenX;
    const y = this.screenY;

    // Center focal point
    ctx.fillStyle = '#0038A8';
    ctx.beginPath();
    ctx.arc(x, y, this.isHovering ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Outer reticle ring
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.isHovering ? '#E03E2D' : 'rgba(0, 56, 168, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y, this.isHovering ? 18 : 12, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair ticks
    const r = this.isHovering ? 24 : 16;
    const innerR = this.isHovering ? 14 : 9;
    ctx.beginPath();
    // Top
    ctx.moveTo(x, y - innerR); ctx.lineTo(x, y - r);
    // Bottom
    ctx.moveTo(x, y + innerR); ctx.lineTo(x, y + r);
    // Left
    ctx.moveTo(x - innerR, y); ctx.lineTo(x - r, y);
    // Right
    ctx.moveTo(x + innerR, y); ctx.lineTo(x + r, y);
    ctx.stroke();

    // Label / Telemetry on hover
    if (this.hoverLabel) {
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = '#16253D';
      ctx.fillText(this.hoverLabel, x + 16, y - 12);
    }

    ctx.restore();
  }
}
