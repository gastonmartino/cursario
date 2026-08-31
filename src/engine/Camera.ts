export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1.0;

  public targetX: number = 0;
  public targetY: number = 0;
  public targetZoom: number = 1.0;

  public minZoom: number = 0.25;
  public maxZoom: number = 2.5;

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private cameraStartX: number = 0;
  private cameraStartY: number = 0;

  // Inertia velocities
  private vx: number = 0;
  private vy: number = 0;
  private lastDragTime: number = 0;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  constructor(initialX = 0, initialY = 0, initialZoom = 1.0) {
    this.x = this.targetX = initialX;
    this.y = this.targetY = initialY;
    this.zoom = this.targetZoom = initialZoom;
  }

  public screenToWorld(screenX: number, screenY: number, viewportWidth: number, viewportHeight: number): { x: number; y: number } {
    const cx = viewportWidth / 2;
    const cy = viewportHeight / 2;
    return {
      x: (screenX - cx) / this.zoom + this.x,
      y: (screenY - cy) / this.zoom + this.y,
    };
  }

  public worldToScreen(worldX: number, worldY: number, viewportWidth: number, viewportHeight: number): { x: number; y: number } {
    const cx = viewportWidth / 2;
    const cy = viewportHeight / 2;
    return {
      x: (worldX - this.x) * this.zoom + cx,
      y: (worldY - this.y) * this.zoom + cy,
    };
  }

  public startDrag(screenX: number, screenY: number) {
    this.isDragging = true;
    this.dragStartX = screenX;
    this.dragStartY = screenY;
    this.cameraStartX = this.x;
    this.cameraStartY = this.y;
    this.vx = 0;
    this.vy = 0;
    this.lastDragTime = performance.now();
    this.lastMouseX = screenX;
    this.lastMouseY = screenY;
  }

  public onDrag(screenX: number, screenY: number) {
    if (!this.isDragging) return;

    const dx = (screenX - this.dragStartX) / this.zoom;
    const dy = (screenY - this.dragStartY) / this.zoom;

    this.x = this.targetX = this.cameraStartX - dx;
    this.y = this.targetY = this.cameraStartY - dy;

    const now = performance.now();
    const dt = Math.max(1, now - this.lastDragTime);
    const instantVx = (this.lastMouseX - screenX) / this.zoom / dt;
    const instantVy = (this.lastMouseY - screenY) / this.zoom / dt;

    this.vx = instantVx * 14;
    this.vy = instantVy * 14;

    this.lastDragTime = now;
    this.lastMouseX = screenX;
    this.lastMouseY = screenY;
  }

  public endDrag() {
    this.isDragging = false;
  }

  public zoomAt(deltaZoom: number, screenX: number, screenY: number, viewportWidth: number, viewportHeight: number) {
    const prevZoom = this.targetZoom;
    const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, prevZoom * deltaZoom));
    
    if (newZoom === prevZoom) return;

    // Zoom centered around the cursor
    const worldBefore = this.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);
    this.targetZoom = newZoom;

    // Adjust targetX/targetY so worldBefore remains under cursor
    const cx = viewportWidth / 2;
    const cy = viewportHeight / 2;
    this.targetX = worldBefore.x - (screenX - cx) / newZoom;
    this.targetY = worldBefore.y - (screenY - cy) / newZoom;
  }

  public panBy(dx: number, dy: number) {
    this.targetX += dx / this.zoom;
    this.targetY += dy / this.zoom;
  }

  public flyTo(worldX: number, worldY: number, zoomLevel = 1.0) {
    this.targetX = worldX;
    this.targetY = worldY;
    this.targetZoom = Math.min(this.maxZoom, Math.max(this.minZoom, zoomLevel));
    this.vx = 0;
    this.vy = 0;
  }

  public update(dt: number) {
    if (!this.isDragging) {
      // Apply momentum inertia
      if (Math.abs(this.vx) > 0.01 || Math.abs(this.vy) > 0.01) {
        this.targetX += this.vx;
        this.targetY += this.vy;
        this.vx *= 0.92;
        this.vy *= 0.92;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
    }

    // Smooth spring/lerp towards target (fluid, organic movement)
    const lerpFactor = Math.min(1, dt * 5.0);
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;
    this.zoom += (this.targetZoom - this.zoom) * lerpFactor;
  }
}
