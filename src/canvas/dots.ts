import Canvas from "./canvas";

interface Dot {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  theta: number;
  phi: number;
}

export default class Dots extends Canvas {
  private dots: Dot[];

  constructor() {
    super();

    // this.context.lineWidth = 0.05;
    this.context.fillStyle = "black"

    this.dots = [];

    for(let i = 0; i < 100; i += 1) {
      const dot: Dot = {
        x: (Math.random() - 0.5) * this.bounds.width,
        y: (Math.random() -0.5) * this.bounds.height,
        z: Math.random() * this.bounds.width,
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos((Math.random() * 2) - 1),
        vx: 0,
        vy: 0
      };

      this.dots.push(dot);
    }
  }

  render() {
    const ctx = this.context;
    const perspective = this.bounds.width * 0.6;
    const radius = this.bounds.width / 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    // ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);
    ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.beginPath();

    this.dots.forEach(dot => {
      // dot.x += dot.vx;
      // dot.y += dot.vy;
      // const scale = perspective / (perspective + dot.z);
      // const x = this.bounds.width / 2 + (dot.x * scale);
      // const y = this.bounds.height / 2 + (dot.y * scale);
      // const w = radius * 2 * scale;
      // const h = radius * 2 * scale;
      const oldx = dot.x;
      const oldy = dot.y;

      dot.theta += 0.012;
      dot.phi += 0.001;
      dot.x = radius * Math.sin(dot.phi) * Math.cos(dot.theta);
      dot.y = radius * Math.cos(dot.phi);
      dot.z = radius * Math.sin(dot.phi) * Math.sin(dot.theta) + radius;

      const scale = perspective / (perspective + dot.z);
      const x = (dot.x * scale) + this.bounds.width / 2;
      const y = (dot.y * scale) + this.bounds.height / 2;
      const prevx = (oldx * scale) + this.bounds.width / 2;
      const prevy = (oldy * scale) + this.bounds.height / 2;

      ctx.globalAlpha = Math.abs(1 - dot.z / this.bounds.width);
      ctx.moveTo(prevx, prevy);
      ctx.lineTo(x, y);
      // ctx.arc(x, y, 2 * scale, 0, Math.PI * 2);
      // ctx.fill();
    });
    ctx.stroke();
  }
}