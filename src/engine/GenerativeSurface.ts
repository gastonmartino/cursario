import { createNoise2D } from 'simplex-noise';
import { CURSOS, ISLOTES_SPATIAL, type Curso } from '../data';

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
    activeDeriva: Curso | null = null,
    hoveredDeriva: Curso | null = null
  ) {
    if (activeDeriva) {
      // LEVEL 2: DERIVA INTERIOR INFINITE CANVAS
      this.drawDerivaLevel(ctx, width, height, camX, camY, zoom, activeDeriva);
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
    hoveredDeriva: Curso | null
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

    // 7. Secondary islands connected to top-level courses
    this.drawIsloteConnections(ctx, width, height, camX, camY, zoom, 'macro');
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
    hoveredDeriva: Curso | null
  ) {
    const cx = width / 2;
    const cy = height / 2;

    for (const deriva of CURSOS) {
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

      // El contenido de cada isla es la tarjeta HTML que se superpone a este
      // marco (ver Isla.astro); el lienzo solo dibuja la hoja y las esquinas.
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
    deriva: Curso
  ) {
    // 1. Dedicated Paper Base
    this.drawAtmosphericPaper(ctx, width, height, camX, camY);

    // 2. Fine Local Grid
    this.drawLocalGrid(ctx, width, height, camX, camY, zoom);

    // 3. Local River Course Connecting the Deriva Items
    this.drawDerivaStream(ctx, width, height, camX, camY, zoom, deriva);

    // 4. Secondary islands connected to subderivas in this local course
    this.drawIsloteConnections(ctx, width, height, camX, camY, zoom, 'deriva', deriva);
  }

  private drawLocalGrid(
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
    deriva: Curso
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

  private drawIsloteConnections(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    level: 'macro' | 'deriva',
    activeDeriva?: Curso
  ) {
    const cx = width / 2;
    const cy = height / 2;
    const toScreen = (x: number, y: number) => ({
      x: (x - camX) * zoom + cx,
      y: (y - camY) * zoom + cy,
    });

    ctx.save();
    ctx.setLineDash([6 * zoom, 5 * zoom]);
    ctx.lineWidth = Math.max(1, 1.5 * zoom);

    for (const islote of ISLOTES_SPATIAL) {
      let parent: { x: number; y: number; accentColor: string } | undefined;

      if (level === 'macro') {
        const deriva = CURSOS.find((item) => item.id === islote.parentId);
        if (deriva) parent = deriva;
      } else if (activeDeriva) {
        const item = activeDeriva.items.find((entry) => entry.id === islote.parentId);
        if (item) parent = item;
      }

      if (!parent) continue;

      const parentPoint = toScreen(parent.x, parent.y);
      const islotePoint = toScreen(islote.x, islote.y);
      const directionX = parentPoint.x - islotePoint.x;
      const directionY = parentPoint.y - islotePoint.y;
      // Use the rendered card dimensions when available. Islote content is
      // dynamic, so the CSS min-height is not always its final height; using
      // the static spatial height makes top/bottom connections end too early
      // or too late.
      const isloteNode = typeof document !== 'undefined'
        ? document.getElementById(`spatial-islote-${islote.id}`)
        : null;
      const renderedWidth = isloteNode instanceof HTMLElement && isloteNode.offsetWidth > 0
        ? isloteNode.offsetWidth
        : islote.width;
      const renderedHeight = isloteNode instanceof HTMLElement && isloteNode.offsetHeight > 0
        ? isloteNode.offsetHeight
        : islote.height;
      const halfWidth = (renderedWidth * zoom) / 2;
      const halfHeight = (renderedHeight * zoom) / 2;
      const horizontalFactor = Math.abs(directionX) > 0 ? halfWidth / Math.abs(directionX) : Infinity;
      const verticalFactor = Math.abs(directionY) > 0 ? halfHeight / Math.abs(directionY) : Infinity;
      const edgeFactor = Math.min(horizontalFactor, verticalFactor);
      const edgeX = islotePoint.x + directionX * edgeFactor;
      const edgeY = islotePoint.y + directionY * edgeFactor;
      const midY = (parentPoint.y + edgeY) / 2;

      ctx.strokeStyle = `${parent.accentColor}99`;
      ctx.beginPath();
      ctx.moveTo(parentPoint.x, parentPoint.y);
      ctx.quadraticCurveTo(parentPoint.x, midY, edgeX, edgeY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = parent.accentColor;
      ctx.beginPath();
      ctx.arc(parentPoint.x, parentPoint.y, Math.max(2, 3 * zoom), 0, Math.PI * 2);
      ctx.fill();
      ctx.setLineDash([6 * zoom, 5 * zoom]);
    }

    ctx.restore();
  }
}
