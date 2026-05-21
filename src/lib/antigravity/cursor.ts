class CursorTracker {
  cursor = { x: 0, y: 0 };
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  private readonly onPointerMove = (event: PointerEvent): void => {
    this.cursor.x = event.clientX;
    this.cursor.y = event.clientY;
  };

  private readonly onResize = (): void => {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  };

  constructor() {
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("resize", this.onResize);
  }
}

export const cursorTracker = new CursorTracker();
