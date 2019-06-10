export default abstract class Canvas {
  private readonly fps = 30;
  private readonly frameInterval = 1000 / this.fps;
  protected startTime = 0;
  protected time = 0;
  protected element: HTMLCanvasElement;
  protected title: HTMLDivElement;
  public readonly context: CanvasRenderingContext2D;
  public readonly bounds: ClientRect;

  constructor() {
    this.title          = document.getElementById("title") as HTMLDivElement;
    this.element        = document.getElementById("canvas") as HTMLCanvasElement;
    this.context        = this.element.getContext("2d")!;
    this.bounds         = this.element.getBoundingClientRect();
    this.element.width  = this.bounds.width;
    this.element.height = this.bounds.height;

    this.context.strokeStyle = "rgba(0, 0, 0, 0.9)";
    this.context.fillStyle   = "rgba(250, 250, 250, 0.9)";
  }

  start() {
    this.startTime = Date.now();
    this.animate();
  }

  private animate = () => {
    window.requestAnimationFrame(this.animate);

    const now = Date.now();
    const elapsed = now - this.time;

    if(elapsed > this.frameInterval) {
      this.time = now - (elapsed % this.frameInterval);
      this.render();
    }
  }

  protected abstract render(): void;
}
