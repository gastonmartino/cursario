import { createNoise2D } from 'simplex-noise';
import { SPATIAL_DERIVAS, type SpatialDeriva, type DerivaItem } from './Derivas';

export class GenerativeSurface {
  private noise2D = createNoise2D();

  // Cached pattern canvas for paper grain
  private grainCanvas: HTMLCanvasElement | null = null;

  constructor() {
    this.initGrain();
  }

  private initGrain() {
    if (typeof document === 'undefined') return;
    this.grainCanvas = document.createElement('canvas');
    this.grainCanvas.width = 128;
    this.grainCanvas.height = 128;
    const ctx = this.grainCanvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(128, 128);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      imgData.data[i] = val;     // R
      imgData.data[i + 1] = val; // G
      imgData.data[i + 2] = val; // B
      imgData.data[i + 3] = 14;  // Very subtle alpha
    }
    ctx.putImageData(imgData, 0, 0);
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    activeDeriva: SpatialDeriva | null = null,
    hoveredDeriva: SpatialDeriva | null = null,
    hoveredItem: DerivaItem | null = null
  ) {
    if (activeDeriva) {
      // LEVEL 2: DERIVA INTERIOR INFINITE CANVAS
      this.drawDerivaLevel(ctx, width, height, camX, camY, zoom, activeDeriva, hoveredItem);
    } else {
      // LEVEL 1: MACRO CARTOGRAPHY
      this.drawMacroLevel(ctx, width, height, camX, camY, zoom, hoveredDeriva);
    }
  }

  /* -------------------------------------------------------------
     LEVEL 1: MACRO CARTOGRAPHY
  ------------------------------------------------------------- */
  private drawMacroLevel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    hoveredDeriva: SpatialDeriva | null
  ) {
    // 1. Base Dynamic Atmospheric Paper Tint
    this.drawAtmosphericPaper(ctx, width, height, camX, camY);

    // 2. Coordinate Technical Grid
    this.drawCartographicGrid(ctx, width, height, camX, camY, zoom);

    // 3. Generative Hydrographic Flow Lines & River Meanders
    this.drawHydrographicCurrents(ctx, width, height, camX, camY, zoom);

    // 4. Overlaid Circuit Schematics & Vector Diagrams
    this.drawElectronicSchematics(ctx, width, height, camX, camY, zoom);

    // 5. Cloud Windows & Halftone Textures
    this.drawAtmosphericWindows(ctx, width, height, camX, camY, zoom);

    // 6. The 4 Spatial Derivas Archipelago
    this.drawDerivaLandmarks(ctx, width, height, camX, camY, zoom, hoveredDeriva);
  }

  private drawAtmosphericPaper(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    baseColorShift: string | null = null
  ) {
    const normX = Math.max(-1, Math.min(1, camX / 2000));
    const normY = Math.max(-1, Math.min(1, camY / 2000));

    const r = Math.floor(246 + normX * 4 - (normY < 0 ? 6 : 0));
    const g = Math.floor(248 - (normY < 0 ? 4 : 0));
    const b = Math.floor(251 + (normY < 0 ? 5 : 0) - (normX > 0 ? 5 : 0));

    ctx.fillStyle = baseColorShift || `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, width, height);

    // Overlay soft radial gradient around center of screen
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.1,
      width / 2, height / 2, width * 0.85
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(215, 226, 238, 0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw repeating subtle grain
    if (this.grainCanvas) {
      ctx.save();
      ctx.globalAlpha = 0.65;
      const pat = ctx.createPattern(this.grainCanvas, 'repeat');
      if (pat) {
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    }
  }

  private drawCartographicGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number
  ) {
    ctx.save();

    const gridSize = 200;
    const cx = width / 2;
    const cy = height / 2;

    const leftWorld = camX - cx / zoom;
    const rightWorld = camX + cx / zoom;
    const topWorld = camY - cy / zoom;
    const bottomWorld = camY + cy / zoom;

    const startX = Math.floor(leftWorld / gridSize) * gridSize;
    const endX = Math.ceil(rightWorld / gridSize) * gridSize;
    const startY = Math.floor(topWorld / gridSize) * gridSize;
    const endY = Math.ceil(bottomWorld / gridSize) * gridSize;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(22, 37, 61, 0.1)'; // Cyanotype faint

    for (let x = startX; x <= endX; x += gridSize) {
      const sx = (x - camX) * zoom + cx;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      const sy = (y - camY) * zoom + cy;
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    if (zoom > 0.4) {
      ctx.font = '9px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(22, 37, 61, 0.35)';

      for (let x = startX; x <= endX; x += gridSize * 2) {
        for (let y = startY; y <= endY; y += gridSize * 2) {
          const sx = (x - camX) * zoom + cx;
          const sy = (y - camY) * zoom + cy;

          ctx.strokeStyle = 'rgba(0, 56, 168, 0.3)';
          ctx.beginPath();
          ctx.moveTo(sx - 4, sy); ctx.lineTo(sx + 4, sy);
          ctx.moveTo(sx, sy - 4); ctx.lineTo(sx, sy + 4);
          ctx.stroke();

          if (zoom > 0.7) {
            ctx.fillText(`${x > 0 ? '+' : ''}${x}, ${y > 0 ? '+' : ''}${y}`, sx + 6, sy + 12);
          }
        }
      }
    }

    ctx.restore();
  }

  private drawHydrographicCurrents(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number
  ) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;

    const rivers = [
      { startX: -2200, startY: -1800, length: 4500, baseAngle: 0.75, width: 2.2, color: 'rgba(0, 56, 168, 0.45)' },
      { startX: -1800, startY: 1200, length: 3800, baseAngle: -0.55, width: 1.6, color: 'rgba(0, 47, 167, 0.35)' },
      { startX: -400, startY: -2200, length: 4200, baseAngle: 1.45, width: 2.8, color: 'rgba(22, 37, 61, 0.4)' }
    ];

    for (const r of rivers) {
      ctx.beginPath();
      ctx.lineWidth = r.width * zoom;
      ctx.strokeStyle = r.color;

      let curX = r.startX;
      let curY = r.startY;

      const firstScreenX = (curX - camX) * zoom + cx;
      const firstScreenY = (curY - camY) * zoom + cy;
      ctx.moveTo(firstScreenX, firstScreenY);

      const steps = 60;
      const stepDist = r.length / steps;

      for (let i = 1; i <= steps; i++) {
        const noiseVal = this.noise2D(curX * 0.0008, curY * 0.0008);
        const angle = r.baseAngle + noiseVal * 1.2;

        curX += Math.cos(angle) * stepDist;
        curY += Math.sin(angle) * stepDist;

        const sx = (curX - camX) * zoom + cx;
        const sy = (curY - camY) * zoom + cy;

        ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      ctx.lineWidth = (r.width * 0.5) * zoom;
      ctx.strokeStyle = 'rgba(0, 56, 168, 0.2)';
      ctx.beginPath();

      curX = r.startX + 24;
      curY = r.startY - 20;
      ctx.moveTo((curX - camX) * zoom + cx, (curY - camY) * zoom + cy);

      for (let i = 1; i <= steps; i++) {
        const noiseVal = this.noise2D((curX + 50) * 0.0008, (curY - 50) * 0.0008);
        const angle = r.baseAngle + noiseVal * 1.1;

        curX += Math.cos(angle) * stepDist;
        curY += Math.sin(angle) * stepDist;

        ctx.lineTo((curX - camX) * zoom + cx, (curY - camY) * zoom + cy);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawElectronicSchematics(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number
  ) {
    if (zoom < 0.35) return;

    ctx.save();
    const cx = width / 2;
    const cy = height / 2;

    const schematics = [
      { x: -550, y: -900, name: 'IC-01: OSCILLATOR 440Hz', pins: 8 },
      { x: 600, y: -750, name: 'DEV-02: SIGNAL MATRIX', pins: 12 },
      { x: -1100, y: 700, name: 'PROC-03: GLSL BUFFER', pins: 10 },
      { x: 950, y: 800, name: 'DISC-04: COGNITIVE BUS', pins: 6 }
    ];

    for (const sc of schematics) {
      const sx = (sc.x - camX) * zoom + cx;
      const sy = (sc.y - camY) * zoom + cy;
      const boxW = 160 * zoom;
      const boxH = 90 * zoom;

      ctx.fillStyle = 'rgba(240, 244, 248, 0.85)';
      ctx.strokeStyle = '#16253D';
      ctx.lineWidth = 1.2 * zoom;

      ctx.fillRect(sx, sy, boxW, boxH);
      ctx.strokeRect(sx, sy, boxW, boxH);

      ctx.beginPath();
      ctx.arc(sx + boxW / 2, sy, 5 * zoom, 0, Math.PI);
      ctx.stroke();

      const pinSpacing = boxH / (sc.pins / 2 + 1);
      ctx.lineWidth = 1 * zoom;
      ctx.strokeStyle = '#0038A8';

      for (let i = 1; i <= sc.pins / 2; i++) {
        const py = sy + i * pinSpacing;
        ctx.beginPath();
        ctx.moveTo(sx, py);
        ctx.lineTo(sx - 30 * zoom, py);
        ctx.lineTo(sx - 50 * zoom, py + (i % 2 === 0 ? 20 : -20) * zoom);
        ctx.stroke();

        ctx.fillStyle = '#0038A8';
        ctx.beginPath();
        ctx.arc(sx - 50 * zoom, py + (i % 2 === 0 ? 20 : -20) * zoom, 2 * zoom, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(sx + boxW, py);
        ctx.lineTo(sx + boxW + 30 * zoom, py);
        ctx.lineTo(sx + boxW + 60 * zoom, py + (i % 2 === 0 ? -15 : 15) * zoom);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx + boxW + 60 * zoom, py + (i % 2 === 0 ? -15 : 15) * zoom, 2 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      if (zoom > 0.6) {
        ctx.font = `${Math.max(8, 10 * zoom)}px "Geist Mono", monospace`;
        ctx.fillStyle = '#16253D';
        ctx.textAlign = 'center';
        ctx.fillText(sc.name, sx + boxW / 2, sy + boxH / 2);
      }
    }

    ctx.restore();
  }

  private drawAtmosphericWindows(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number
  ) {
    if (zoom < 0.3) return;

    ctx.save();
    const cx = width / 2;
    const cy = height / 2;

    const windows = [
      { x: -300, y: -450, r: 85, title: 'ATMOSPHERE: 01 // SKY' },
      { x: 450, y: 350, r: 100, title: 'WATER MEMORY // 02' },
      { x: -800, y: -300, r: 70, title: 'CUMULUS FORMATION' },
    ];

    for (const win of windows) {
      const sx = (win.x - camX) * zoom + cx;
      const sy = (win.y - camY) * zoom + cy;
      const radius = win.r * zoom;

      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.clip();

      const skyGrad = ctx.createLinearGradient(sx, sy - radius, sx, sy + radius);
      skyGrad.addColorStop(0, '#7EA8CE');
      skyGrad.addColorStop(0.6, '#A6C6E2');
      skyGrad.addColorStop(1, '#D8E5F3');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(sx - radius, sy - radius, radius * 2, radius * 2);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(sx - 15 * zoom, sy + 10 * zoom, 40 * zoom, 0, Math.PI * 2);
      ctx.arc(sx + 20 * zoom, sy + 15 * zoom, 35 * zoom, 0, Math.PI * 2);
      ctx.arc(sx + 5 * zoom, sy - 10 * zoom, 30 * zoom, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 56, 168, 0.25)';
      const dotStep = Math.max(4, 8 * zoom);
      for (let dx = -radius; dx <= radius; dx += dotStep) {
        for (let dy = -radius; dy <= radius; dy += dotStep) {
          if (dx * dx + dy * dy < radius * radius) {
            ctx.fillRect(sx + dx, sy + dy, 1.2 * zoom, 1.2 * zoom);
          }
        }
      }

      ctx.restore();

      ctx.lineWidth = 1.2 * zoom;
      ctx.strokeStyle = '#0038A8';
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(sx - radius - 8 * zoom, sy); ctx.lineTo(sx - radius, sy);
      ctx.moveTo(sx + radius, sy); ctx.lineTo(sx + radius + 8 * zoom, sy);
      ctx.moveTo(sx, sy - radius - 8 * zoom); ctx.lineTo(sx, sy - radius);
      ctx.moveTo(sx, sy + radius); ctx.lineTo(sx, sy + radius + 8 * zoom);
      ctx.stroke();

      if (zoom > 0.6) {
        ctx.font = '9px "Geist Mono", monospace';
        ctx.fillStyle = '#0038A8';
        ctx.textAlign = 'center';
        ctx.fillText(win.title, sx, sy + radius + 16 * zoom);
      }
    }

    ctx.restore();
  }

  private drawDerivaLandmarks(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    hoveredDeriva: SpatialDeriva | null
  ) {
    const cx = width / 2;
    const cy = height / 2;

    for (const deriva of SPATIAL_DERIVAS) {
      const sx = (deriva.x - camX) * zoom + cx;
      const sy = (deriva.y - camY) * zoom + cy;
      const zw = deriva.width * zoom;
      const zh = deriva.height * zoom;

      const left = sx - zw / 2;
      const top = sy - zh / 2;

      const isHovered = hoveredDeriva?.id === deriva.id;

      ctx.save();

      // Drop shadow simulation
      ctx.fillStyle = isHovered ? 'rgba(0, 56, 168, 0.08)' : 'rgba(22, 37, 61, 0.04)';
      ctx.fillRect(left + (isHovered ? 8 : 6) * zoom, top + (isHovered ? 8 : 6) * zoom, zw, zh);

      // Main Sheet (Papel Vegetal / Plano)
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.94)';
      ctx.strokeStyle = isHovered ? deriva.accentColor : '#D0D6E2';
      ctx.lineWidth = Math.max(1, (isHovered ? 2 : 1.2) * zoom);

      ctx.fillRect(left, top, zw, zh);
      ctx.strokeRect(left, top, zw, zh);

      // Technical Drafting Corner Brackets
      const bracketLen = 16 * zoom;
      ctx.strokeStyle = deriva.accentColor;
      ctx.lineWidth = 2 * zoom;

      // Corners
      ctx.beginPath();
      ctx.moveTo(left - 4 * zoom, top + bracketLen);
      ctx.lineTo(left - 4 * zoom, top - 4 * zoom);
      ctx.lineTo(left + bracketLen, top - 4 * zoom);

      ctx.moveTo(left + zw + 4 * zoom, top + bracketLen);
      ctx.lineTo(left + zw + 4 * zoom, top - 4 * zoom);
      ctx.lineTo(left + zw - bracketLen, top - 4 * zoom);

      ctx.moveTo(left - 4 * zoom, top + zh - bracketLen);
      ctx.lineTo(left - 4 * zoom, top + zh + 4 * zoom);
      ctx.lineTo(left + bracketLen, top + zh + 4 * zoom);

      ctx.moveTo(left + zw + 4 * zoom, top + zh - bracketLen);
      ctx.lineTo(left + zw + 4 * zoom, top + zh + 4 * zoom);
      ctx.lineTo(left + zw - bracketLen, top + zh + 4 * zoom);
      ctx.stroke();

      // Skip inner canvas text rendering for islands rendered via HTML DOM cards
      if (deriva.id === 'en-curso' || deriva.id === 'generativa' || deriva.id === 'untref' || deriva.id === 'pensamiento') {
        ctx.restore();
        continue;
      }

      // Header Banner
      ctx.fillStyle = 'rgba(240, 244, 249, 0.9)';
      ctx.fillRect(left, top, zw, 36 * zoom);
      ctx.strokeStyle = 'rgba(22, 37, 61, 0.12)';
      ctx.lineWidth = 1 * zoom;
      ctx.beginPath();
      ctx.moveTo(left, top + 36 * zoom);
      ctx.lineTo(left + zw, top + 36 * zoom);
      ctx.stroke();

      // Tag Badge
      ctx.fillStyle = deriva.accentColor;
      ctx.fillRect(left + 16 * zoom, top + 10 * zoom, 8 * zoom, 16 * zoom);

      // Code & Tag Text
      ctx.font = `bold ${Math.max(9, 11 * zoom)}px "Geist Mono", monospace`;
      ctx.fillStyle = '#16253D';
      ctx.textAlign = 'left';
      ctx.fillText(deriva.code, left + 32 * zoom, top + 22 * zoom);

      ctx.font = `${Math.max(8, 10 * zoom)}px "Geist Mono", monospace`;
      ctx.fillStyle = deriva.accentColor;
      ctx.textAlign = 'right';
      ctx.fillText(deriva.tag, left + zw - 16 * zoom, top + 22 * zoom);

      // Main Title
      ctx.font = `bold ${Math.max(12, 22 * zoom)}px "Geist Sans", "PP Neue Montreal", sans-serif`;
      ctx.fillStyle = '#1A1C20';
      ctx.textAlign = 'left';
      ctx.fillText(deriva.name, left + 24 * zoom, top + 72 * zoom);

      // Subtitle
      ctx.font = `${Math.max(10, 14 * zoom)}px "Geist Sans", sans-serif`;
      ctx.fillStyle = '#0038A8';
      ctx.fillText(deriva.subtitle, left + 24 * zoom, top + 98 * zoom);

      // Divider line
      ctx.strokeStyle = 'rgba(0, 56, 168, 0.15)';
      ctx.beginPath();
      ctx.moveTo(left + 24 * zoom, top + 114 * zoom);
      ctx.lineTo(left + zw - 24 * zoom, top + 114 * zoom);
      ctx.stroke();

      // Description text
      if (zoom > 0.45) {
        ctx.font = `${Math.max(9, 13 * zoom)}px "Geist Sans", sans-serif`;
        ctx.fillStyle = '#4A505C';
        this.wrapText(ctx, deriva.description, left + 24 * zoom, top + 140 * zoom, zw - 48 * zoom, 20 * zoom);
      }

      // Action Button: "INCURSIONAR [ENTER / CLICK]"
      if (zoom > 0.48) {
        const btnHeight = 36 * zoom;
        const btnY = top + zh - btnHeight - 16 * zoom;
        const btnX = left + 24 * zoom;
        const btnW = zw - 48 * zoom;

        ctx.fillStyle = isHovered ? '#0038A8' : 'rgba(0, 56, 168, 0.07)';
        ctx.fillRect(btnX, btnY, btnW, btnHeight);

        ctx.strokeStyle = isHovered ? '#002270' : 'rgba(0, 56, 168, 0.35)';
        ctx.lineWidth = 1.2 * zoom;
        ctx.strokeRect(btnX, btnY, btnW, btnHeight);

        ctx.font = `bold ${Math.max(9, 11 * zoom)}px "Geist Mono", monospace`;
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#0038A8';
        ctx.textAlign = 'center';
        ctx.fillText('INCURSIONAR [ENTER / CLICK]', btnX + btnW / 2, btnY + btnHeight / 2 + 4 * zoom);
      }

      ctx.restore();
    }
  }

  /* -------------------------------------------------------------
     LEVEL 2: LOCAL DERIVA CANVAS
  ------------------------------------------------------------- */
  private drawDerivaLevel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    deriva: SpatialDeriva,
    hoveredItem: DerivaItem | null
  ) {
    const cx = width / 2;
    const cy = height / 2;

    // 1. Dedicated Paper Base
    this.drawAtmosphericPaper(ctx, width, height, camX, camY);

    // 2. Fine Local Grid
    this.drawLocalGrid(ctx, width, height, camX, camY, zoom, deriva.accentColor);

    // 3. Local River Course Connecting the Deriva Items
    this.drawDerivaStream(ctx, width, height, camX, camY, zoom, deriva);

    // 4. Background Watermark Banner
    this.drawDerivaHeaderWatermark(ctx, width, height, deriva);

    // 5. Render Placeholder Cards along the Course
    this.drawDerivaItems(ctx, width, height, camX, camY, zoom, deriva, hoveredItem);
  }

  private drawLocalGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    accentColor: string
  ) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;
    const step = 150;

    const leftWorld = camX - cx / zoom;
    const rightWorld = camX + cx / zoom;
    const topWorld = camY - cy / zoom;
    const bottomWorld = camY + cy / zoom;

    const startX = Math.floor(leftWorld / step) * step;
    const endX = Math.ceil(rightWorld / step) * step;
    const startY = Math.floor(topWorld / step) * step;
    const endY = Math.ceil(bottomWorld / step) * step;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(0, 56, 168, 0.08)';

    for (let x = startX; x <= endX; x += step) {
      const sx = (x - camX) * zoom + cx;
      ctx.beginPath();
      ctx.moveTo(sx, 0); ctx.lineTo(sx, height);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += step) {
      const sy = (y - camY) * zoom + cy;
      ctx.beginPath();
      ctx.moveTo(0, sy); ctx.lineTo(width, sy);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawDerivaStream(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    deriva: SpatialDeriva
  ) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;

    const items = deriva.items;
    if (items.length >= 2) {
      // Connect items with a flowing meander line
      ctx.beginPath();
      ctx.lineWidth = 3 * zoom;
      ctx.strokeStyle = deriva.accentColor;

      const firstSx = (items[0].x - camX) * zoom + cx;
      const firstSy = (items[0].y - camY) * zoom + cy;
      ctx.moveTo(firstSx, firstSy);

      for (let i = 0; i < items.length - 1; i++) {
        const p1 = items[i];
        const p2 = items[i + 1];

        const s1x = (p1.x - camX) * zoom + cx;
        const s1y = (p1.y - camY) * zoom + cy;
        const s2x = (p2.x - camX) * zoom + cx;
        const s2y = (p2.y - camY) * zoom + cy;

        const midX = (s1x + s2x) / 2;
        const midY = (s1y + s2y) / 2 + 50 * zoom;

        ctx.quadraticCurveTo(midX, midY, s2x, s2y);
      }
      ctx.stroke();

      // Parallel decorative dashed line
      ctx.save();
      ctx.setLineDash([6 * zoom, 6 * zoom]);
      ctx.lineWidth = 1.2 * zoom;
      ctx.strokeStyle = 'rgba(0, 56, 168, 0.4)';
      ctx.beginPath();

      const offsetSy = firstSy - 18 * zoom;
      ctx.moveTo(firstSx, offsetSy);

      for (let i = 0; i < items.length - 1; i++) {
        const p1 = items[i];
        const p2 = items[i + 1];
        const s1x = (p1.x - camX) * zoom + cx;
        const s2x = (p2.x - camX) * zoom + cx;
        const s2y = (p2.y - camY) * zoom + cy - 18 * zoom;
        const midX = (s1x + s2x) / 2;
        const midY = ((p1.y + p2.y) / 2 - camY) * zoom + cy + 32 * zoom;
        ctx.quadraticCurveTo(midX, midY, s2x, s2y);
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  private drawDerivaHeaderWatermark(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    deriva: SpatialDeriva
  ) {
    ctx.save();
    ctx.font = 'bold 10px "Geist Mono", monospace';
    ctx.fillStyle = 'rgba(22, 37, 61, 0.25)';
    ctx.textAlign = 'left';
    ctx.fillText(`DERIVA ACTIVA // [${deriva.code}] ${deriva.name.toUpperCase()} • RECORRIDO EN CURSO`, 24, height - 24);
    ctx.restore();
  }

  private drawDerivaItems(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    deriva: SpatialDeriva,
    hoveredItem: DerivaItem | null
  ) {
    // Rich HTML islands above the canvas keep all subderiva media and
    // Markdown readable at every zoom level.
    if (deriva.items.length > 0) return;

    const cx = width / 2;
    const cy = height / 2;

    for (const item of deriva.items) {
      const sx = (item.x - camX) * zoom + cx;
      const sy = (item.y - camY) * zoom + cy;
      const iw = item.width * zoom;
      const ih = item.height * zoom;

      const left = sx - iw / 2;
      const top = sy - ih / 2;

      const isHovered = hoveredItem?.id === item.id;

      ctx.save();

      // Drop shadow
      ctx.fillStyle = isHovered ? 'rgba(0, 56, 168, 0.12)' : 'rgba(22, 37, 61, 0.05)';
      ctx.fillRect(left + 6 * zoom, top + 6 * zoom, iw, ih);

      // Card Body
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.99)' : 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = isHovered ? item.accentColor : '#D0D6E2';
      ctx.lineWidth = Math.max(1, (isHovered ? 2 : 1.2) * zoom);

      ctx.fillRect(left, top, iw, ih);
      ctx.strokeRect(left, top, iw, ih);

      // Corner drafting brackets
      const bLen = 14 * zoom;
      ctx.strokeStyle = item.accentColor;
      ctx.lineWidth = 1.8 * zoom;

      ctx.beginPath();
      ctx.moveTo(left - 3 * zoom, top + bLen); ctx.lineTo(left - 3 * zoom, top - 3 * zoom); ctx.lineTo(left + bLen, top - 3 * zoom);
      ctx.moveTo(left + iw + 3 * zoom, top + bLen); ctx.lineTo(left + iw + 3 * zoom, top - 3 * zoom); ctx.lineTo(left + iw - bLen, top - 3 * zoom);
      ctx.moveTo(left - 3 * zoom, top + ih - bLen); ctx.lineTo(left - 3 * zoom, top + ih + 3 * zoom); ctx.lineTo(left + bLen, top + ih + 3 * zoom);
      ctx.moveTo(left + iw + 3 * zoom, top + ih - bLen); ctx.lineTo(left + iw + 3 * zoom, top + ih + 3 * zoom); ctx.lineTo(left + iw - bLen, top + ih + 3 * zoom);
      ctx.stroke();

      // Top Bar
      ctx.fillStyle = 'rgba(240, 244, 249, 0.95)';
      ctx.fillRect(left, top, iw, 30 * zoom);
      ctx.strokeStyle = 'rgba(22, 37, 61, 0.1)';
      ctx.lineWidth = 1 * zoom;
      ctx.beginPath();
      ctx.moveTo(left, top + 30 * zoom);
      ctx.lineTo(left + iw, top + 30 * zoom);
      ctx.stroke();

      // Code & Tag
      ctx.font = `bold ${Math.max(8, 10 * zoom)}px "Geist Mono", monospace`;
      ctx.fillStyle = item.accentColor;
      ctx.textAlign = 'left';
      ctx.fillText(item.code, left + 14 * zoom, top + 19 * zoom);

      ctx.font = `${Math.max(7, 9 * zoom)}px "Geist Mono", monospace`;
      ctx.fillStyle = '#16253D';
      ctx.textAlign = 'right';
      ctx.fillText(item.tag, left + iw - 14 * zoom, top + 19 * zoom);

      // Title
      ctx.font = `bold ${Math.max(11, 16 * zoom)}px "Geist Sans", sans-serif`;
      ctx.fillStyle = '#1A1C20';
      ctx.textAlign = 'left';
      ctx.fillText(item.title, left + 18 * zoom, top + 58 * zoom);

      // Subtitle
      ctx.font = `${Math.max(9, 12 * zoom)}px "Geist Sans", sans-serif`;
      ctx.fillStyle = '#0038A8';
      ctx.fillText(item.subtitle, left + 18 * zoom, top + 78 * zoom);

      // Summary
      if (zoom > 0.5) {
        ctx.font = `${Math.max(8, 11 * zoom)}px "Geist Sans", sans-serif`;
        ctx.fillStyle = '#4A505C';
        this.wrapText(ctx, item.summary, left + 18 * zoom, top + 104 * zoom, iw - 36 * zoom, 16 * zoom);
      }

      // Bottom Trigger
      if (zoom > 0.5) {
        const bH = 28 * zoom;
        const bY = top + ih - bH - 12 * zoom;
        const bX = left + 18 * zoom;
        const bW = iw - 36 * zoom;

        ctx.fillStyle = isHovered ? '#0038A8' : 'rgba(0, 56, 168, 0.06)';
        ctx.fillRect(bX, bY, bW, bH);
        ctx.strokeStyle = isHovered ? '#002270' : 'rgba(0, 56, 168, 0.3)';
        ctx.lineWidth = 1 * zoom;
        ctx.strokeRect(bX, bY, bW, bH);

        ctx.font = `bold ${Math.max(7, 9 * zoom)}px "Geist Mono", monospace`;
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#0038A8';
        ctx.textAlign = 'center';
        ctx.fillText('VER REGISTRO / DETALLE [PRÓXIMAMENTE]', bX + bW / 2, bY + bH / 2 + 3 * zoom);
      }

      ctx.restore();
    }
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }
}
