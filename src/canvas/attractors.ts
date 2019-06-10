import Canvas from "./canvas";

type Types = "left" | "centerLine" | "centerPoint" | "cross" | "network";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default class Attractors extends Canvas {
  private points: Point[];
  private type: number;
  private scale: number;
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  constructor() {
    super();

    this.context.lineWidth = 0.05;

    this.points = [];
    this.type   = Math.floor(Math.random() * 5) + 1;
    this.scale  = Math.random() * 0.01;

    const attract = this.type < 4 ? 4 : Math.floor(Math.random() * (this.type === 4 ? 360 : 1000)) + 0.1;

    this.a      = Math.random() * attract - (attract / 2);
    this.b      = Math.random() * attract - (attract / 2);
    this.c      = Math.random() * attract - (attract / 2);
    this.d      = Math.random() * attract - (attract / 2);

    for(let i = 0; i < this.bounds.height; i += 0.5) {
      const x = this.type === 1 ? 0 : this.bounds.width / 2;
      const y = this.type >= 3 ? this.bounds.height / 2 : i;
      const p: Point = {
        x: x,
        y: y,
        vx: 0,
        vy: 0
      };

      if(this.type >= 3) {
        p.vx += (Math.random() * 360 - 180) * 0.03;
        p.vy += (Math.random() * 360 - 180) * 0.03;
      }

      this.points.push(p);
    }
  }

  render() {
    const ctx    = this.context;
    // const size   = Math.min(bounds.height, bounds.width);
    // const speed  = this.time * 0.000005;

    // ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
    ctx.beginPath();

    for(let i = 0; i < this.points.length; i++) {
      const p     = this.points[i];
      const angle = this.getAngle(p);

      ctx.moveTo(p.x, p.y);

      p.vx += Math.cos(angle) * 0.3;
      p.vy += Math.sin(angle) * 0.3;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;

      ctx.lineTo(p.x, p.y);

      if(p.x > this.bounds.width) p.x = 0;
      if(p.y > this.bounds.height) p.y = 0;
      if(p.x < 0) p.x = this.bounds.width;
      if(p.y < 0) p.y = this.bounds.height;
    }

    ctx.stroke();
  }

  private getAngle(point: Point) {
    // clifford attractor
    // http://paulbourke.net/fractals/clifford/

    const x  = (point.x - this.bounds.width / 2) * this.scale;
    const y  = (point.y - this.bounds.height / 2) * this.scale;
    const x1 = Math.sin(this.a * y) + this.c * Math.cos(this.a * x);
    const y1 = Math.sin(this.b * x) + this.d * Math.cos(this.b * y);

    // x1 = d * Math.sin(a * x) - Math.sin(b * y)
    // y1 = c * Math.cos(a * x) + Math.cos(b * y)

    // find angle from old to new. that's the value.
    return Math.atan2(y1 - y, x1 - x);
  }

}