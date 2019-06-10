import Canvas from "./canvas";

export default class Circle extends Canvas {
  private grow: boolean = false;
  private radius: number = 1;
  private step: number = 0;

  render() {
    const bounds = this.bounds;
    const ctx    = this.context;
    const size   = Math.min(bounds.height, bounds.width);
    const speed  = this.time * 0.000005;

    ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
    ctx.beginPath();

    const a = 2;//(2 * S(this.time * 0.000001));
    const b = 2;//(3 * S(this.time * 0.000002));
    const c = (18 * Math.sin(speed));
    const d = 3;
    const f = (g: (x: number) => number, i: number) => a * g(b * i / c) + g(-i / d);

    let i = size;
    while(i > 0) {
      const z = 10;//7 + f(S, i) * S(t) - S(i) * C(t);
      const x = bounds.width / 2 + Math.max(size, this.radius) * (f(Math.sin, i)) / z;
      const y = bounds.height / 2 + Math.max(size, this.radius) * f(Math.cos, i) / z

      ctx.lineTo(x, y);
      i--;
    }

    ctx.stroke();

    if(this.grow) {
      if(this.radius < 4000) {
        this.radius += this.step;
      }
      else if(Math.random() > 0.995) {
        this.grow = false;
        this.step = 1 + Math.random() * 100;
      }
    }
    else if(this.radius > 1) {
      this.radius -= this.step;
    }
    else {
      if(Math.random() > 0.995) {
        this.grow = true;
        this.radius = size;
        this.step = 1 + Math.random() * 100;
      }
    }
  }
}