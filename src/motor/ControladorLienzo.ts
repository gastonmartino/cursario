import { Camara } from './Camara';
import { CursorEntintado } from './CursorEntintado';
import { SuperficieGenerativa } from './SuperficieGenerativa';
import { DERIVAS_ISLOTES, DERIVAS_INSULAS, type DerivaInsula, type DerivaIsla } from './Derivas';

/**
 * Lo único del contenido que el motor necesita, pedido por id. Lo provee
 * quien crea el motor, que es quien conoce el contenido de cada elemento.
 */
export interface AparienciaLienzo {
  // Color de acento de un curso o subcurso.
  accentColor: (id: string) => string;
  // Texto junto al cursor sobre un curso o subcurso: 'hover' al pasar por
  // encima, 'select' al hacer click.
  cursorLabel: (id: string, action: 'hover' | 'select') => string;
}

const APARIENCIA_NEUTRA: AparienciaLienzo = {
  accentColor: () => '#0038A8',
  cursorLabel: () => '',
};

export interface DatosTelemetria {
  worldX: number;
  worldY: number;
  zoom: number;
  level: 'macro' | 'deriva';
  activeDeriva: DerivaInsula | null;
  hoveredDeriva: DerivaInsula | null;
  hoveredItem: DerivaIsla | null;
}

export type AlActualizarTelemetria = (data: DatosTelemetria) => void;
export type AlCambiarDeNivel = (type: 'enter' | 'exit', deriva: DerivaInsula | null) => void;

export class ControladorLienzo {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private camera: Camara;
  private cursor: CursorEntintado;
  private surface: SuperficieGenerativa;

  public level: 'macro' | 'deriva' = 'macro';
  public activeDeriva: DerivaInsula | null = null;
  public hoveredDeriva: DerivaInsula | null = null;
  public hoveredItem: DerivaIsla | null = null;

  // Bucle de dibujo bajo demanda: solo se pide un cuadro al navegador cuando
  // algo cambió o hay una animación en curso (cámara en movimiento, estela
  // del cursor). Con todo quieto, el motor no hace nada.
  private cuadroPendiente: number = 0;
  private lastTime: number = 0;
  // La escena (lienzo principal, tarjetas HTML y HUD) cambió por algo que no
  // es la cámara: nivel, sobrevuelo, tamaño de la ventana, fuentes o islotes.
  private escenaPendiente: boolean = true;
  // El lienzo del cursor necesita redibujarse aunque no esté animando.
  private cursorPendiente: boolean = true;
  // Cámara con la que se dibujó la escena por última vez.
  private ultimaCamara = { x: NaN, y: NaN, zoom: NaN };
  private dpr: number = 1;

  private telemetryCallback: AlActualizarTelemetria | null = null;
  private transitionCallback: AlCambiarDeNivel | null = null;

  // Touch tracking
  private touches: Map<number, { x: number; y: number }> = new Map();
  private initialPinchDist: number = 0;
  private initialPinchZoom: number = 1;
  private isPinching: boolean = false;

  // Click tracking
  private mouseDownPos = { x: 0, y: 0, time: 0 };

  private cursorCanvas: HTMLCanvasElement | null = null;
  private cursorCtx: CanvasRenderingContext2D | null = null;

  private appearance: AparienciaLienzo;

  constructor(
    canvas: HTMLCanvasElement, 
    onTelemetry?: AlActualizarTelemetria,
    onTransition?: AlCambiarDeNivel,
    cursorCanvas?: HTMLCanvasElement,
    appearance: AparienciaLienzo = APARIENCIA_NEUTRA
  ) {
    this.canvas = canvas;
    this.appearance = appearance;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Failed to get 2D canvas context');
    }
    this.ctx = context;

    if (cursorCanvas) {
      this.cursorCanvas = cursorCanvas;
      this.cursorCtx = cursorCanvas.getContext('2d');
    }

    const initialDeriva = DERIVAS_INSULAS.find((deriva) => deriva.id === 'en-curso');
    this.camera = new Camara(0, 0, initialDeriva ? this.getMacroZoom(initialDeriva) : 0.9);
    this.cursor = new CursorEntintado();
    this.surface = new SuperficieGenerativa(appearance.accentColor);

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
    this.observarCambiosExternos();
    this.despertar(true, true);
  }

  /**
   * Cambios que afectan el dibujo sin pasar por el motor: las fuentes
   * terminan de cargarse (textos del lienzo) y los islotes cambian de tamaño
   * al cargar sus imágenes (las líneas de conexión usan su tamaño real).
   */
  private observarCambiosExternos() {
    document.fonts?.ready.then(() => this.despertar(true, true));

    if (typeof ResizeObserver !== 'undefined') {
      const observador = new ResizeObserver(() => this.despertar(true));
      for (const islote of DERIVAS_ISLOTES) {
        const nodo = document.getElementById(`spatial-islote-${islote.id}`);
        if (nodo) observador.observe(nodo);
      }
    }
  }

  /**
   * Pide un cuadro al navegador, si no hay uno pendiente. `escena` y `cursor`
   * marcan qué hay que redibujar aunque la cámara no se haya movido.
   */
  private despertar(escena = false, cursor = false) {
    if (escena) this.escenaPendiente = true;
    if (cursor) this.cursorPendiente = true;
    if (this.cuadroPendiente) return;

    // Al salir del reposo, el primer cuadro avanza como si hubiera pasado un
    // solo cuadro (y no todo el tiempo de reposo), para no dar un salto.
    this.lastTime = performance.now() - 1000 / 60;
    this.cuadroPendiente = requestAnimationFrame(this.loop);
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

  private getMacroZoom(deriva: DerivaInsula, preferredZoom = 0.9) {
    return this.getZoomToFit(deriva.ancho, deriva.alto, preferredZoom);
  }

  private getDerivaZoom(deriva: DerivaInsula, preferredZoom = 0.95) {
    if (deriva.subcursos.length === 0) {
      return this.getZoomToFit(deriva.ancho, deriva.alto, preferredZoom);
    }

    const left = Math.min(...deriva.subcursos.map((item) => item.x - item.ancho / 2));
    const right = Math.max(...deriva.subcursos.map((item) => item.x + item.ancho / 2));
    const top = Math.min(...deriva.subcursos.map((item) => item.y - item.alto / 2));
    const bottom = Math.max(...deriva.subcursos.map((item) => item.y + item.alto / 2));

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

    this.despertar(true, true);
  }

  public onMouseDown(e: MouseEvent) {
    if (e.button === 0 || e.button === 1) {
      this.camera.startDrag(e.clientX, e.clientY);
      this.cursor.isDragging = true;
      this.mouseDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    }
    this.despertar();
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
    this.despertar(false, true);
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
    this.despertar();
  }

  private handleClick() {
    if (this.level === 'macro') {
      if (this.hoveredDeriva) {
        this.incursionar(this.hoveredDeriva.id);
      }
    } else if (this.level === 'deriva' && this.hoveredItem) {
      // In the future: open deep-reading modal/drawer
      this.cursor.hoverLabel = this.appearance.cursorLabel(this.hoveredItem.id, 'select');
      this.despertar(false, true);
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
    this.despertar(false, true);
  }

  public onTouchStart(e: TouchEvent) {
    e.preventDefault();
    // Synchronize all active contacts. A second finger can begin over a
    // different DOM layer (or over an interactive child), so relying only on
    // changedTouches can leave the controller unaware of the first finger.
    this.touches.clear();
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      this.touches.set(t.identifier, { x: t.clientX, y: t.clientY });
    }

    if (this.touches.size === 1) {
      const t = e.touches[0];
      this.camera.startDrag(t.clientX, t.clientY);
      this.cursor.setPosition(t.clientX, t.clientY, 0, 0);
      this.mouseDownPos = { x: t.clientX, y: t.clientY, time: performance.now() };
    } else if (this.touches.size === 2) {
      // A pinch is a separate gesture from a one-finger pan. Stop the
      // previous drag so the remaining finger can be re-anchored cleanly
      // when the pinch ends.
      this.isPinching = true;
      this.camera.endDrag();
      const [t1, t2] = [e.touches[0], e.touches[1]];
      this.initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      this.initialPinchZoom = this.camera.zoom;
    }
    this.despertar(false, true);
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
    this.despertar(false, true);
  }

  public onTouchEnd(e: TouchEvent) {
    if (this.touches.size === 1 && !this.isPinching) {
      const t = e.changedTouches[0];
      const dist = Math.hypot(t.clientX - this.mouseDownPos.x, t.clientY - this.mouseDownPos.y);
      if (dist < 10 && (performance.now() - this.mouseDownPos.time) < 300) {
        this.handleClick();
      }
    }

    for (let i = 0; i < e.changedTouches.length; i++) {
      this.touches.delete(e.changedTouches[i].identifier);
    }

    if (this.touches.size === 1 && this.isPinching) {
      // Resume one-finger panning from the remaining finger's current
      // position instead of from the position where the pinch began.
      const remainingTouch = e.touches[0];
      this.camera.startDrag(remainingTouch.clientX, remainingTouch.clientY);
      this.mouseDownPos = {
        x: remainingTouch.clientX,
        y: remainingTouch.clientY,
        time: performance.now(),
      };
    } else if (this.touches.size === 0) {
      // En una pantalla táctil no hay "mouse encima": al levantar el dedo,
      // después de procesar el toque, ninguna tarjeta queda marcada.
      this.marcarSobrevuelo(null);
      this.camera.endDrag();
      this.isPinching = false;
      this.initialPinchDist = 0;
    }
    this.despertar();
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
          this.despertar();
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

  /* -------------------------------------------------------------
     SOBREVUELO: QUÉ CURSO O SUBCURSO TIENE EL PUNTERO ENCIMA
     Lo detectan las tarjetas HTML, que conocen su tamaño real, y lo
     informan por id. Un id que no corresponde al nivel actual se ignora.
  ------------------------------------------------------------- */
  public marcarSobrevuelo(id: string | null) {
    if (this.level === 'macro') {
      this.hoveredDeriva = DERIVAS_INSULAS.find((deriva) => deriva.id === id) ?? null;
    } else {
      this.hoveredItem = this.activeDeriva?.subcursos.find((isla) => isla.id === id) ?? null;
    }

    const marcado = this.level === 'macro' ? this.hoveredDeriva : this.hoveredItem;
    this.cursor.isHovering = !!marcado;
    this.cursor.hoverLabel = marcado ? this.appearance.cursorLabel(marcado.id, 'hover') : '';
    this.despertar(true, true);
  }

  // Quita la marca solo si sigue marcado este id (otra tarjeta pudo haberla
  // tomado mientras tanto).
  public desmarcarSobrevuelo(id: string) {
    const marcado = this.level === 'macro' ? this.hoveredDeriva : this.hoveredItem;
    if (marcado?.id === id) this.marcarSobrevuelo(null);
  }

  /* -------------------------------------------------------------
     TRANSICIONES DE NIVEL (INCURSIONAR & VOLVER)
  ------------------------------------------------------------- */
  public incursionar(derivaId?: string) {
    const targetId = derivaId || this.hoveredDeriva?.id || 'en-curso';
    const targetDeriva = DERIVAS_INSULAS.find((d) => d.id === targetId);

    if (!targetDeriva) return;

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
    this.despertar(true, true);
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
    this.despertar(true, true);
  }

  public flyToDeriva(derivaId: string) {
    if (this.level === 'macro') {
      const d = DERIVAS_INSULAS.find((item) => item.id === derivaId);
      if (d) {
        this.camera.flyTo(d.x, d.y, this.getMacroZoom(d));
        this.despertar();
      }
    } else {
      // If in Level 2, switch directly to that Deriva
      this.incursionar(derivaId);
    }
  }

  public resetView() {
    if (this.level === 'macro') {
      const initialDeriva = DERIVAS_INSULAS.find((deriva) => deriva.id === 'en-curso');
      this.camera.flyTo(0, 0, initialDeriva ? this.getMacroZoom(initialDeriva) : 0.9);
    } else {
      this.camera.flyTo(0, 0, this.activeDeriva ? this.getDerivaZoom(this.activeDeriva) : 0.95);
    }
    this.despertar();
  }

  public zoomIn() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.zoomAt(1.25, w / 2, h / 2, w, h);
    this.despertar();
  }

  public zoomOut() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.zoomAt(0.8, w / 2, h / 2, w, h);
    this.despertar();
  }

  private loop = () => {
    this.cuadroPendiente = 0;

    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    const cursorAnimaba = this.cursor.estaAnimando();
    this.camera.update(dt);
    this.cursor.update(dt);

    const camara = this.ultimaCamara;
    const camaraCambio =
      this.camera.x !== camara.x || this.camera.y !== camara.y || this.camera.zoom !== camara.zoom;

    if (camaraCambio || this.escenaPendiente) {
      this.escenaPendiente = false;
      this.ultimaCamara = { x: this.camera.x, y: this.camera.y, zoom: this.camera.zoom };
      this.notifyTelemetry();
      this.syncSpatialDomNodes();
      this.renderSurface();
    }

    // Se redibuja también el cuadro en que la estela termina, para borrarla.
    if (this.cursorPendiente || cursorAnimaba || this.cursor.estaAnimando()) {
      this.cursorPendiente = false;
      this.renderCursor();
    }

    // Mientras haya animación se sigue pidiendo cuadros, sin reiniciar el
    // reloj (eso solo lo hace despertar() al salir del reposo).
    const animando = this.camera.estaEnMovimiento() || this.cursor.estaAnimando();
    if (animando && !this.cuadroPendiente) {
      this.cuadroPendiente = requestAnimationFrame(this.loop);
    }
  };

  private notifyTelemetry() {
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
  }

  private syncSpatialDomNodes() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (const d of DERIVAS_INSULAS) {
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
    for (const deriva of DERIVAS_INSULAS) {
      for (const item of deriva.subcursos) {
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

    // Islotes live in the same coordinate space as their parent. A top-level
    // parent shows its islotes in the macro view; a subderiva parent shows
    // them only while its containing deriva is active.
    for (const islote of DERIVAS_ISLOTES) {
      const node = document.getElementById(`spatial-islote-${islote.id}`);
      if (!node) continue;

      const topLevelParent = DERIVAS_INSULAS.find((deriva) => deriva.id === islote.idSuperior);
      const containingDeriva = topLevelParent || DERIVAS_INSULAS.find((deriva) =>
        deriva.subcursos.some((item) => item.id === islote.idSuperior)
      );
      const shouldShow = topLevelParent
        ? this.level === 'macro'
        : this.level === 'deriva' && this.activeDeriva?.id === containingDeriva?.id;

      if (!shouldShow) {
        node.style.display = 'none';
        continue;
      }

      const screen = this.camera.worldToScreen(islote.x, islote.y, w, h);
      node.style.display = 'flex';
      node.style.transform = `translate3d(${screen.x.toFixed(2)}px, ${screen.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${this.camera.zoom.toFixed(4)})`;
      node.style.opacity = this.camera.zoom < 0.22 ? '0' : '1';
      node.style.pointerEvents = this.camera.zoom < 0.22 ? 'none' : 'auto';
    }
  }

  private renderSurface() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);
    this.surface.draw(
      this.ctx,
      w,
      h,
      this.camera.x,
      this.camera.y,
      this.camera.zoom,
      this.activeDeriva
    );
    this.ctx.restore();
  }

  // Mira, estela y etiqueta del cursor, en su propio lienzo (encima de todo).
  private renderCursor() {
    if (!this.cursorCtx || !this.cursorCanvas) return;

    this.cursorCtx.save();
    this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
    this.cursorCtx.scale(this.dpr, this.dpr);
    this.cursor.draw(this.cursorCtx);
    this.cursorCtx.restore();
  }
}
