import { createNoise2D } from 'simplex-noise';
import { DERIVAS_ISLOTES, DERIVAS_INSULAS, DERIVAS_REFLOTADAS, posicionReflotada, type DerivaInsula } from './Derivas';

// Rojo de los acentos del sitio (accent-vermilion en tailwind.config.mjs).
const ROJO_ACENTO = '#E03E2D';

export class CartografiaGenerativa {
  private noise2D = createNoise2D();

  // Cached pattern canvas for paper grain
  private grainCanvas: HTMLCanvasElement | null = null;

  // Color de acento de un curso o subcurso, por id (ver AparienciaLienzo).
  private accentColor: (id: string) => string;

  constructor(accentColor: (id: string) => string) {
    this.accentColor = accentColor;
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
    activeDeriva: DerivaInsula | null = null
  ) {
    if (activeDeriva) {
      // LEVEL 2: DERIVA INTERIOR INFINITE CANVAS
      this.drawDerivaLevel(ctx, width, height, camX, camY, zoom, activeDeriva);
    } else {
      // LEVEL 1: MACRO CARTOGRAPHY
      this.drawMacroLevel(ctx, width, height, camX, camY, zoom);
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
    zoom: number
  ) {
    // 1. Base Dynamic Atmospheric Paper Tint
    this.drawAtmosphericPaper(ctx, width, height, camX, camY);

    // 2. Coordinate Technical Grid
    this.drawCartographicGrid(ctx, width, height, camX, camY, zoom);

    // 3. Generative Hydrographic Flow Lines & River Meanders
    this.drawHydrographicCurrents(ctx, width, height, camX, camY, zoom);

    // 4. Overlaid Circuit Schematics & Vector Diagrams
    this.drawElectronicSchematics(ctx, width, height, camX, camY, zoom);

    // 5. El curso que une las ínsulas, en el orden de sus códigos: punteado,
    // grueso y en el rojo de los acentos.
    this.drawCursoDeInsulas(ctx, width, height, camX, camY, zoom);

    // 6. Ínsulas reflotadas: una envolvente punteada alrededor de sus islas.
    for (const deriva of DERIVAS_REFLOTADAS) {
      this.drawEnvolvente(ctx, width, height, camX, camY, zoom, deriva);
    }

    // 7. Ínsulas reflotadas: el curso que une la ínsula con sus islas, que
    // están en este lienzo (con posiciones relativas a la ínsula).
    for (const deriva of DERIVAS_REFLOTADAS) {
      const recorrido = [
        { ...deriva.subcursos[0], id: deriva.id, x: deriva.x, y: deriva.y },
        ...deriva.subcursos.map((isla) => ({ ...isla, ...posicionReflotada(isla)! })),
      ];
      this.drawDerivaStream(ctx, width, height, camX, camY, zoom, { ...deriva, subcursos: recorrido });
    }

    // 8. Secondary islands connected to top-level courses
    // (las ínsulas son tarjetas HTML: el lienzo no dibuja nada debajo de ellas)
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

  // ENVOLVENTE DE UNA ÍNSULA REFLOTADA
  // Una curva cerrada que rodea a sus islas (no a los islotes), a ENV_MARGEN
  // de ellas (la mitad de la separación mínima con otras tarjetas). Para que sea una curva continua sin colarse en los huecos
  // grandes (donde puede haber otras ínsulas), se toma la unión de las islas
  // ensanchadas, se le cierran los entrantes de menos de 2 × ENV_CIERRE
  // (cierre morfológico: dilatar y erosionar) y el contorno se suaviza. Las
  // posiciones no cambian, así que se calcula una sola vez por ínsula.
  private envolventes = new Map<string, Array<Array<{ x: number; y: number }>>>();

  private calcularEnvolvente(deriva: DerivaInsula) {
    const ENV_MARGEN = 40;
    const ENV_CIERRE = 260;
    const PASO = 30;
    const cajas = deriva.subcursos.map((isla) => {
      const { x, y } = posicionReflotada(isla)!;
      return { x1: x - isla.ancho / 2, x2: x + isla.ancho / 2, y1: y - isla.alto / 2, y2: y + isla.alto / 2 };
    });
    // Distancia de un punto al conjunto de islas (0 adentro de una).
    const distancia = (px: number, py: number) => Math.min(...cajas.map((c) =>
      Math.hypot(Math.max(c.x1 - px, 0, px - c.x2), Math.max(c.y1 - py, 0, py - c.y2))));
    const borde = ENV_MARGEN + ENV_CIERRE + 2 * PASO;
    const x0 = Math.min(...cajas.map((c) => c.x1)) - borde;
    const y0 = Math.min(...cajas.map((c) => c.y1)) - borde;
    const nx = Math.ceil((Math.max(...cajas.map((c) => c.x2)) + borde - x0) / PASO) + 1;
    const ny = Math.ceil((Math.max(...cajas.map((c) => c.y2)) + borde - y0) / PASO) + 1;
    // 1. Dilatación: a menos de ENV_MARGEN + ENV_CIERRE de alguna isla.
    const dilatada: boolean[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      dilatada.push(distancia(x0 + i * PASO, y0 + j * PASO) <= ENV_MARGEN + ENV_CIERRE);
    }
    const dentroDe = (i: number, j: number) => i >= 0 && j >= 0 && i < nx && j < ny && dilatada[j * nx + i];
    // 2. Erosión: quedan los puntos a más de ENV_CIERRE de lo que quedó afuera.
    const afuera: Array<[number, number]> = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      if (dilatada[j * nx + i]) continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([di, dj]) => dentroDe(i + di, j + dj))) afuera.push([i, j]);
    }
    const campo: boolean[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      campo.push(dilatada[j * nx + i] && afuera.every(([ai, aj]) => Math.hypot((ai - i) * PASO, (aj - j) * PASO) > ENV_CIERRE));
    }
    const en = (i: number, j: number) => i >= 0 && j >= 0 && i < nx && j < ny && campo[j * nx + i];
    // 3. Contorno (marching squares): segmentos entre los puntos medios de los
    // lados de cada celda, en coordenadas de medio paso.
    const siguiente = new Map<string, string>();
    const puntos = new Map<string, { x: number; y: number }>();
    for (let j = -1; j < ny; j++) for (let i = -1; i < nx; i++) {
      const lados = {
        arriba: [2 * i + 1, 2 * j], derecha: [2 * i + 2, 2 * j + 1],
        abajo: [2 * i + 1, 2 * j + 2], izquierda: [2 * i, 2 * j + 1],
      } as const;
      type Lado = keyof typeof lados;
      const caso = (en(i, j) ? 8 : 0) | (en(i + 1, j) ? 4 : 0) | (en(i + 1, j + 1) ? 2 : 0) | (en(i, j + 1) ? 1 : 0);
      const pares: Record<number, Array<[Lado, Lado]>> = {
        1: [['izquierda', 'abajo']], 2: [['abajo', 'derecha']], 3: [['izquierda', 'derecha']],
        4: [['derecha', 'arriba']], 5: [['izquierda', 'arriba'], ['derecha', 'abajo']], 6: [['abajo', 'arriba']],
        7: [['izquierda', 'arriba']], 8: [['arriba', 'izquierda']], 9: [['arriba', 'abajo']],
        10: [['arriba', 'derecha'], ['abajo', 'izquierda']], 11: [['arriba', 'derecha']], 12: [['derecha', 'izquierda']],
        13: [['derecha', 'abajo']], 14: [['abajo', 'izquierda']],
      };
      for (const [desde, hasta] of pares[caso] ?? []) {
        const [ax, ay] = lados[desde], [bx, by] = lados[hasta];
        siguiente.set(`${ax},${ay}`, `${bx},${by}`);
        puntos.set(`${ax},${ay}`, { x: x0 + (ax / 2) * PASO, y: y0 + (ay / 2) * PASO });
        puntos.set(`${bx},${by}`, { x: x0 + (bx / 2) * PASO, y: y0 + (by / 2) * PASO });
      }
    }
    // Los segmentos se encadenan en lazos cerrados.
    const lazos: Array<Array<{ x: number; y: number }>> = [];
    const vistos = new Set<string>();
    for (const inicio of siguiente.keys()) {
      if (vistos.has(inicio)) continue;
      const lazo: Array<{ x: number; y: number }> = [];
      let actual: string | undefined = inicio;
      while (actual && !vistos.has(actual)) {
        vistos.add(actual);
        lazo.push(puntos.get(actual)!);
        actual = siguiente.get(actual);
      }
      if (lazo.length > 8) lazos.push(lazo);
    }
    // 4. Suavizado: primero un promedio con los vecinos (borra los escalones
    // de la grilla), después Chaikin.
    return lazos.map((lazo) => {
      let curva = lazo;
      for (let vuelta = 0; vuelta < 3; vuelta++) {
        curva = curva.map((p, k) => {
          const a = curva[(k - 1 + curva.length) % curva.length], b = curva[(k + 1) % curva.length];
          return { x: (a.x + 2 * p.x + b.x) / 4, y: (a.y + 2 * p.y + b.y) / 4 };
        });
      }
      for (let vuelta = 0; vuelta < 3; vuelta++) {
        curva = curva.flatMap((p, k) => {
          const q = curva[(k + 1) % curva.length];
          return [
            { x: 0.75 * p.x + 0.25 * q.x, y: 0.75 * p.y + 0.25 * q.y },
            { x: 0.25 * p.x + 0.75 * q.x, y: 0.25 * p.y + 0.75 * q.y },
          ];
        });
      }
      return curva;
    });
  }

  private drawEnvolvente(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    deriva: DerivaInsula
  ) {
    if (!this.envolventes.has(deriva.id)) this.envolventes.set(deriva.id, this.calcularEnvolvente(deriva));
    const cx = width / 2;
    const cy = height / 2;
    ctx.save();
    // Fina y punteada, como las conexiones de los islotes, en un rojo suave.
    ctx.setLineDash([6 * zoom, 5 * zoom]);
    ctx.lineWidth = Math.max(1, 1.5 * zoom);
    ctx.strokeStyle = 'rgba(224, 62, 45, 0.55)';
    for (const lazo of this.envolventes.get(deriva.id)!) {
      ctx.beginPath();
      lazo.forEach((p, k) => {
        const sx = (p.x - camX) * zoom + cx;
        const sy = (p.y - camY) * zoom + cy;
        if (k === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      });
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Curso que une las ínsulas en el lienzo principal, con la misma curva que
  // el recorrido de las islas de un curso (drawDerivaStream).
  private drawCursoDeInsulas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number
  ) {
    if (DERIVAS_INSULAS.length < 2) return;
    const cx = width / 2;
    const cy = height / 2;
    const pantalla = (x: number, y: number) => ({ x: (x - camX) * zoom + cx, y: (y - camY) * zoom + cy });

    ctx.save();
    ctx.lineWidth = Math.max(1.5, 6 * zoom);
    ctx.strokeStyle = ROJO_ACENTO;
    ctx.setLineDash([18 * zoom, 14 * zoom]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    const primera = pantalla(DERIVAS_INSULAS[0].x, DERIVAS_INSULAS[0].y);
    ctx.moveTo(primera.x, primera.y);
    for (let i = 0; i < DERIVAS_INSULAS.length - 1; i++) {
      const p1 = pantalla(DERIVAS_INSULAS[i].x, DERIVAS_INSULAS[i].y);
      const p2 = pantalla(DERIVAS_INSULAS[i + 1].x, DERIVAS_INSULAS[i + 1].y);
      ctx.quadraticCurveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 + 50 * zoom, p2.x, p2.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawDerivaLevel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camX: number,
    camY: number,
    zoom: number,
    deriva: DerivaInsula
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
    deriva: DerivaInsula
  ) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;

    const items = deriva.subcursos;
    if (items.length >= 2) {
      // Connect items with a flowing meander line
      ctx.beginPath();
      ctx.lineWidth = 3 * zoom;
      ctx.strokeStyle = this.accentColor(deriva.id);

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
    activeDeriva?: DerivaInsula
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

    for (const islote of DERIVAS_ISLOTES) {
      let parent: { id: string; x: number; y: number } | undefined;
      // Un islote de una isla reflotada está en el lienzo principal.
      const flotante = level === 'macro' ? posicionReflotada(islote) : null;

      if (level === 'macro') {
        const deriva = DERIVAS_INSULAS.find((item) => item.id === islote.idSuperior);
        if (deriva) parent = deriva;
        else if (flotante) {
          const isla = DERIVAS_REFLOTADAS.flatMap((entrada) => entrada.subcursos).find((item) => item.id === islote.idSuperior)!;
          parent = { id: isla.id, ...posicionReflotada(isla)! };
        }
      } else if (activeDeriva) {
        const item = activeDeriva.subcursos.find((entry) => entry.id === islote.idSuperior);
        if (item) parent = item;
      }

      if (!parent) continue;

      const parentPoint = toScreen(parent.x, parent.y);
      const islotePoint = toScreen((flotante ?? islote).x, (flotante ?? islote).y);
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
        : islote.ancho;
      const renderedHeight = isloteNode instanceof HTMLElement && isloteNode.offsetHeight > 0
        ? isloteNode.offsetHeight
        : islote.alto;
      const halfWidth = (renderedWidth * zoom) / 2;
      const halfHeight = (renderedHeight * zoom) / 2;
      const horizontalFactor = Math.abs(directionX) > 0 ? halfWidth / Math.abs(directionX) : Infinity;
      const verticalFactor = Math.abs(directionY) > 0 ? halfHeight / Math.abs(directionY) : Infinity;
      const edgeFactor = Math.min(horizontalFactor, verticalFactor);
      const edgeX = islotePoint.x + directionX * edgeFactor;
      const edgeY = islotePoint.y + directionY * edgeFactor;
      const midY = (parentPoint.y + edgeY) / 2;

      ctx.strokeStyle = `${this.accentColor(parent.id)}99`;
      ctx.beginPath();
      ctx.moveTo(parentPoint.x, parentPoint.y);
      ctx.quadraticCurveTo(parentPoint.x, midY, edgeX, edgeY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = this.accentColor(parent.id);
      ctx.beginPath();
      ctx.arc(parentPoint.x, parentPoint.y, Math.max(2, 3 * zoom), 0, Math.PI * 2);
      ctx.fill();
      ctx.setLineDash([6 * zoom, 5 * zoom]);
    }

    ctx.restore();
  }
}
