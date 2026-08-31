import { Camera } from './Camera';
import { InkCursor } from './InkCursor';
import { GenerativeSurface } from './GenerativeSurface';
import { SPATIAL_DERIVAS, type SpatialDeriva, type DerivaItem } from './SpatialZones';

export interface TelemetryData {
  worldX: number;
  worldY: number;
  zoom: number;
  level: 'macro' | 'deriva';
  activeDeriva: SpatialDeriva | null;
  hoveredDeriva: SpatialDeriva | null;
  hoveredItem: DerivaItem | null;
}

export type TelemetryCallback = (data: TelemetryData) => void;
export type TransitionCallback = (type: 'enter' | 'exit', deriva: SpatialDeriva | null) => void;

export class CanvasController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private camera: Camera;
  private cursor: InkCursor;
  private surface: GenerativeSurface;

  public level: 'macro' | 'deriva' = 'macro';
  public activeDeriva: SpatialDeriva | null = null;
  public hoveredDeriva: SpatialDeriva | null = null;
  public hoveredItem: DerivaItem | null = null;

  // Stash macro camera state to restore upon exiting
  private macroCameraState = { x: 0, y: 0, zoom: 0.9 };

  private isRunning: boolean = false;
  private lastTime: number = 0;
  private dpr: number = 1;

  private telemetryCallback: TelemetryCallback | null = null;
  private transitionCallback: TransitionCallback | null = null;

  // Touch tracking
  private touches: Map<number, { x: number; y: number }> = new Map();
  private initialPinchDist: number = 0;
  private initialPinchZoom: number = 1;

  // Click tracking
  private mouseDownPos = { x: 0, y: 0, time: 0 };

  private cursorCanvas: HTMLCanvasElement | null = null;
  private cursorCtx: CanvasRenderingContext2D | null = null;

  constructor(
    canvas: HTMLCanvasElement, 
    onTelemetry?: TelemetryCallback,
    onTransition?: TransitionCallback,
    cursorCanvas?: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Failed to get 2D canvas context');
    }
    this.ctx = context;

    if (cursorCanvas) {
      this.cursorCanvas = cursorCanvas;
      this.cursorCtx = cursorCanvas.getContext('2d');
    }

    const initialDeriva = SPATIAL_DERIVAS.find((deriva) => deriva.id === 'en-curso');
    this.camera = new Camera(0, 0, initialDeriva ? this.getMacroZoom(initialDeriva) : 0.9);
    this.cursor = new InkCursor();
    this.surface = new GenerativeSurface();

    if (onTelemetry) {
      this.telemetryCallback = onTelemetry;
    }
    if (onTransition) {
      this.transitionCallback = onTransition;
    }

    this.init();
  }

  private init() {
    this.handleResize();
    this.bindEvents();
    this.start();
  }

  /**
   * Preserve the desktop composition while reducing the starting scale on
   * smaller viewports so that the current island or deriva fits as fully as
   * possible. The camera's minimum zoom remains the hard lower bound.
   */
  private getZoomToFit(contentWidth: number, contentHeight: number, preferredZoom: number) {
    const viewportPadding = 24;
    const availableWidth = Math.max(1, window.innerWidth - viewportPadding * 2);
    const availableHeight = Math.max(1, window.innerHeight - viewportPadding * 2);
    const fitZoom = Math.min(availableWidth / contentWidth, availableHeight / contentHeight);

    return Math.max(0.25, Math.min(preferredZoom, fitZoom, 2.5));
  }

  private getMacroZoom(deriva: SpatialDeriva, preferredZoom = 0.9) {
    return this.getZoomToFit(deriva.width, deriva.height, preferredZoom);
  }

  private getDerivaZoom(deriva: SpatialDeriva, preferredZoom = 0.95) {
    if (deriva.items.length === 0) {
      return this.getZoomToFit(deriva.width, deriva.height, preferredZoom);
    }

    const left = Math.min(...deriva.items.map((item) => item.x - item.width / 2));
    const right = Math.max(...deriva.items.map((item) => item.x + item.width / 2));
    const top = Math.min(...deriva.items.map((item) => item.y - item.height / 2));
    const bottom = Math.max(...deriva.items.map((item) => item.y + item.height / 2));

    return this.getZoomToFit(right - left, bottom - top, preferredZoom);
  }

  private bindEvents() {
    window.addEventListener('resize', () => this.handleResize());

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    this.canvas.addEventListener('touchcancel', (e) => this.onTouchEnd(e));

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  public handleResize() {
    this.dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    if (this.cursorCanvas) {
      this.cursorCanvas.width = Math.floor(w * this.dpr);
      this.cursorCanvas.height = Math.floor(h * this.dpr);
      this.cursorCanvas.style.width = `${w}px`;
      this.cursorCanvas.style.height = `${h}px`;
    }
  }

  public onMouseDown(e: MouseEvent) {
    if (e.button === 0 || e.button === 1) {
      this.camera.startDrag(e.clientX, e.clientY);
      this.cursor.isDragging = true;
      this.mouseDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    }
  }

  public onMouseMove(e: MouseEvent) {
    this.camera.onDrag(e.clientX, e.clientY);

    const worldPos = this.camera.screenToWorld(
      e.clientX,
      e.clientY,
      window.innerWidth,
      window.innerHeight
    );

    this.cursor.setPosition(e.clientX, e.clientY, worldPos.x, worldPos.y);

    // Hit testing
    if (this.level === 'macro') {
      this.checkMacroHover(worldPos.x, worldPos.y);
    } else if (this.activeDeriva) {
      this.checkDerivaItemHover(worldPos.x, worldPos.y);
    }
  }

  public onMouseUp(e: MouseEvent) {
    const dist = Math.hypot(e.clientX - this.mouseDownPos.x, e.clientY - this.mouseDownPos.y);
    const duration = performance.now() - this.mouseDownPos.time;

    this.camera.endDrag();
    this.cursor.isDragging = false;

    // Detect click (not drag)
    if (dist < 6 && duration < 300) {
      this.handleClick();
    }
  }

  private handleClick() {
    if (this.level === 'macro') {
      if (this.hoveredDeriva) {
        this.incursionar(this.hoveredDeriva.id);
      }
    } else if (this.level === 'deriva' && this.hoveredItem) {
      // In the future: open deep-reading modal/drawer
      this.cursor.hoverLabel = `[REGISTRO ACTIVO] ${this.hoveredItem.title}`;
    }
  }

  public onWheel(e: WheelEvent) {
    e.preventDefault();

    if (e.ctrlKey || Math.abs(e.deltaY) > 50) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.camera.zoomAt(zoomFactor, e.clientX, e.clientY, window.innerWidth, window.innerHeight);
    } else {
      this.camera.panBy(e.deltaX * 0.9, e.deltaY * 0.9);
    }

    const worldPos = this.camera.screenToWorld(
      e.clientX,
      e.clientY,
      window.innerWidth,
      window.innerHeight
    );
    this.cursor.setPosition(e.clientX, e.clientY, worldPos.x, worldPos.y);
  }

  public onTouchStart(e: TouchEvent) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      this.touches.set(t.identifier, { x: t.clientX, y: t.clientY });
    }

    if (this.touches.size === 1) {
      const t = e.touches[0];
      this.camera.startDrag(t.clientX, t.clientY);
      this.cursor.setPosition(t.clientX, t.clientY, 0, 0);
      this.mouseDownPos = { x: t.clientX, y: t.clientY, time: performance.now() };
    } else if (this.touches.size === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      this.initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      this.initialPinchZoom = this.camera.zoom;
    }
  }

  public onTouchMove(e: TouchEvent) {
    e.preventDefault();

    if (this.touches.size === 1 && e.touches.length === 1) {
      const t = e.touches[0];
      this.camera.onDrag(t.clientX, t.clientY);
      const worldPos = this.camera.screenToWorld(
        t.clientX,
        t.clientY,
        window.innerWidth,
        window.innerHeight
      );
      this.cursor.setPosition(t.clientX, t.clientY, worldPos.x, worldPos.y);

      if (this.level === 'macro') {
        this.checkMacroHover(worldPos.x, worldPos.y);
      } else {
        this.checkDerivaItemHover(worldPos.x, worldPos.y);
      }
    } else if (this.touches.size === 2 && e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (this.initialPinchDist > 0) {
        const factor = dist / this.initialPinchDist;
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        this.camera.zoomAt(factor / (this.camera.zoom / this.initialPinchZoom), midX, midY, window.innerWidth, window.innerHeight);
      }
    }
  }

  public onTouchEnd(e: TouchEvent) {
    if (this.touches.size === 1) {
      const t = e.changedTouches[0];
      const dist = Math.hypot(t.clientX - this.mouseDownPos.x, t.clientY - this.mouseDownPos.y);
      if (dist < 10 && (performance.now() - this.mouseDownPos.time) < 300) {
        this.handleClick();
      }
    }

    for (let i = 0; i < e.changedTouches.length; i++) {
      this.touches.delete(e.changedTouches[i].identifier);
    }
    if (this.touches.size === 0) {
      this.camera.endDrag();
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.key === 'Escape') {
      if (this.level === 'deriva') {
        this.exitDeriva();
      }
      return;
    }

    if (e.key === 'Enter') {
      if (this.level === 'macro' && this.hoveredDeriva) {
        this.incursionar(this.hoveredDeriva.id);
      }
      return;
    }

    if (this.level === 'macro') {
      switch (e.key) {
        case '0':
        case 'r':
        case 'R':
          this.resetView();
          break;
        case '1':
          this.flyToDeriva('en-curso');
          break;
        case '2':
          this.flyToDeriva('untref');
          break;
        case '3':
          this.flyToDeriva('generativa');
          break;
        case '4':
          this.flyToDeriva('pensamiento');
          break;
        case '+':
        case '=':
          this.zoomIn();
          break;
        case '-':
        case '_':
          this.zoomOut();
          break;
      }
    } else {
      switch (e.key) {
        case '0':
        case 'r':
        case 'R':
          this.camera.flyTo(0, 0, this.activeDeriva ? this.getDerivaZoom(this.activeDeriva) : 0.95);
          break;
        case '+':
        case '=':
          this.zoomIn();
          break;
        case '-':
        case '_':
          this.zoomOut();
          break;
      }
    }
  }

  private checkMacroHover(worldX: number, worldY: number) {
    let found: SpatialDeriva | null = null;

    for (const d of SPATIAL_DERIVAS) {
      const hw = d.width / 2;
      const hh = d.height / 2;
      if (
        worldX >= d.x - hw &&
        worldX <= d.x + hw &&
        worldY >= d.y - hh &&
        worldY <= d.y + hh
      ) {
        found = d;
        break;
      }
    }

    this.hoveredDeriva = found;
    this.cursor.isHovering = !!found;
    this.cursor.hoverLabel = found ? `[${found.code}] INCURSIONAR [CLICK]` : '';
  }

  private checkDerivaItemHover(worldX: number, worldY: number) {
    if (!this.activeDeriva) return;

    let found: DerivaItem | null = null;
    for (const item of this.activeDeriva.items) {
      const hw = item.width / 2;
      const hh = item.height / 2;
      if (
        worldX >= item.x - hw &&
        worldX <= item.x + hw &&
        worldY >= item.y - hh &&
        worldY <= item.y + hh
      ) {
        found = item;
        break;
      }
    }

    this.hoveredItem = found;
    this.cursor.isHovering = !!found;
    this.cursor.hoverLabel = found ? `[${found.code}] ${found.title}` : '';
  }

  /* -------------------------------------------------------------
     TRANSICIONES DE NIVEL (INCURSIONAR & VOLVER)
  ------------------------------------------------------------- */
  public incursionar(derivaId?: string) {
    const targetId = derivaId || this.hoveredDeriva?.id || 'en-curso';
    const targetDeriva = SPATIAL_DERIVAS.find((d) => d.id === targetId);

    if (!targetDeriva) return;

    // Save macro state
    this.macroCameraState = {
      x: this.camera.x,
      y: this.camera.y,
      zoom: this.camera.zoom
    };

    if (this.transitionCallback) {
      this.transitionCallback('enter', targetDeriva);
    }

    // Switch level to Deriva canvas
    this.level = 'deriva';
    this.activeDeriva = targetDeriva;
    this.hoveredDeriva = null;
    this.hoveredItem = null;

    // Center camera in local Deriva coordinates
    this.camera.x = 0;
    this.camera.y = 0;
    const derivaZoom = this.getDerivaZoom(targetDeriva);
    this.camera.zoom = Math.min(0.5, derivaZoom); // Start slightly zoomed out for cinematic entrance
    this.camera.flyTo(0, 0, derivaZoom);
  }

  public exitDeriva() {
    if (this.level !== 'deriva' || !this.activeDeriva) return;

    const exitingDeriva = this.activeDeriva;

    if (this.transitionCallback) {
      this.transitionCallback('exit', exitingDeriva);
    }

    this.level = 'macro';
    this.activeDeriva = null;
    this.hoveredItem = null;

    // Return to Deriva position in macro coordinates
    this.camera.x = exitingDeriva.x;
    this.camera.y = exitingDeriva.y;
    const macroZoom = this.getMacroZoom(exitingDeriva, 0.85);
    this.camera.zoom = macroZoom;
    this.camera.flyTo(exitingDeriva.x, exitingDeriva.y, macroZoom);
  }

  public flyToDeriva(derivaId: string) {
    if (this.level === 'macro') {
      const d = SPATIAL_DERIVAS.find((item) => item.id === derivaId);
      if (d) {
        this.camera.flyTo(d.x, d.y, this.getMacroZoom(d));
      }
    } else {
      // If in Level 2, switch directly to that Deriva
      this.incursionar(derivaId);
    }
  }

  // Alias for backward compatibility
  public flyToZone(derivaId: string) {
    this.flyToDeriva(derivaId);
  }

  public resetView() {
    if (this.level === 'macro') {
      const initialDeriva = SPATIAL_DERIVAS.find((deriva) => deriva.id === 'en-curso');
      this.camera.flyTo(0, 0, initialDeriva ? this.getMacroZoom(initialDeriva) : 0.9);
    } else {
      this.camera.flyTo(0, 0, this.activeDeriva ? this.getDerivaZoom(this.activeDeriva) : 0.95);
    }
  }

  public zoomIn() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.zoomAt(1.25, w / 2, h / 2, w, h);
  }

  public zoomOut() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.zoomAt(0.8, w / 2, h / 2, w, h);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
  }

  private loop = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.camera.update(dt);
    this.cursor.update(dt);

    if (this.telemetryCallback) {
      this.telemetryCallback({
        worldX: Math.round(this.camera.x * 10) / 10,
        worldY: Math.round(this.camera.y * 10) / 10,
        zoom: Math.round(this.camera.zoom * 100),
        level: this.level,
        activeDeriva: this.activeDeriva,
        hoveredDeriva: this.hoveredDeriva,
        hoveredItem: this.hoveredItem
      });
    }

    this.syncSpatialDomNodes();
  }

  private syncSpatialDomNodes() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (const d of SPATIAL_DERIVAS) {
      const node = document.getElementById(`spatial-node-${d.id}`);
      if (!node) continue;

      if (this.level === 'macro') {
        const screen = this.camera.worldToScreen(d.x, d.y, w, h);
        
        node.style.display = 'flex';
        node.style.transform = `translate3d(${screen.x.toFixed(2)}px, ${screen.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${this.camera.zoom.toFixed(4)})`;
        node.style.opacity = this.camera.zoom < 0.22 ? '0' : '1';
        node.style.pointerEvents = this.camera.zoom < 0.22 ? 'none' : 'auto';
      } else {
        node.style.display = 'none';
      }
    }

    // Every local deriva uses rich HTML islands for its second-level content.
    for (const deriva of SPATIAL_DERIVAS) {
      for (const item of deriva.items) {
        const node = document.getElementById(`spatial-subnode-${item.id}`);
        if (!node) continue;

        const shouldShow = this.level === 'deriva' && this.activeDeriva?.id === deriva.id;
        if (!shouldShow) {
          node.style.display = 'none';
          continue;
        }

        const screen = this.camera.worldToScreen(item.x, item.y, w, h);
        node.style.display = 'flex';
        node.style.transform = `translate3d(${screen.x.toFixed(2)}px, ${screen.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${this.camera.zoom.toFixed(4)})`;
        node.style.opacity = this.camera.zoom < 0.22 ? '0' : '1';
        node.style.pointerEvents = this.camera.zoom < 0.22 ? 'none' : 'auto';
      }
    }
  }

  private render() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);

    // Render background surface on main canvas (z-10)
    this.surface.draw(
      this.ctx,
      w,
      h,
      this.camera.x,
      this.camera.y,
      this.camera.zoom,
      this.activeDeriva,
      this.hoveredDeriva,
      this.hoveredItem
    );

    this.ctx.restore();

    // Render ink trail and reticle cursor on top-layer cursor canvas (z-40) if available
    if (this.cursorCtx && this.cursorCanvas) {
      this.cursorCtx.save();
      this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
      this.cursorCtx.scale(this.dpr, this.dpr);
      this.cursor.draw(this.cursorCtx);
      this.cursorCtx.restore();
    } else {
      this.ctx.save();
      this.ctx.scale(this.dpr, this.dpr);
      this.cursor.draw(this.ctx);
      this.ctx.restore();
    }
  }
}
