import Canvas from "./canvas";

export default class FractalTree extends Canvas {
  private lineLength: number;
  private startHeight: number;
  private maxAngle: number
  private type: "large"|"small";

  constructor() {
    super();

    const lineSize   = 5 + Math.random() * 20;
    this.lineLength  = this.bounds.height / lineSize;
    this.maxAngle    = 20 + Math.random() * 340;
    this.type = Math.random() > 0.5 ? "large" : "small";

    if(this.type === "small") {
      this.startHeight = this.bounds.height / (1.4 + lineSize / 30);
      this.title.style.top = `${this.startHeight + 50}px`;
    }
    else {
      this.startHeight = (this.bounds.height + this.lineLength) / 2;
    }

    this.context.strokeStyle = "rgba(0, 0, 0, 0.5)";
    this.context.fillStyle = "rgba(250, 250, 250, 0.75)";
    console.log(this);
  }

  render() {
    this.context.fillRect(0, 0, this.bounds.width, this.bounds.height);
    this.context.beginPath();
    this.fractalLine(this.bounds.width / 2, this.startHeight, 0, 1);
    this.context.stroke();
  }

  private fractalLine(x: number, y: number, angle: number, iteration: number) {
    if(iteration > 13) return;

    const ctx    = this.context;
    const length = this.lineLength / (this.type === "large" ? 1 : iteration);
    const radian = 0 - Math.PI / 2 + angle * Math.PI / 180;
    const cx     = x + (length * Math.cos(radian));
    const cy     = y + (length * Math.sin(radian));

    ctx.moveTo(x, y);
    ctx.lineTo(cx, cy);

    const adjust = this.maxAngle * Math.sin(this.time * 0.00005);
    this.fractalLine(cx, cy, angle - adjust, iteration + 1);
    this.fractalLine(cx, cy, angle + adjust, iteration + 1);
  }
}