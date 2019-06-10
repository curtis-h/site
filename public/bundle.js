var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("canvas/canvas", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Canvas {
        constructor() {
            this.fps = 30;
            this.frameInterval = 1000 / this.fps;
            this.startTime = 0;
            this.time = 0;
            this.animate = () => {
                window.requestAnimationFrame(this.animate);
                const now = Date.now();
                const elapsed = now - this.time;
                if (elapsed > this.frameInterval) {
                    this.time = now - (elapsed % this.frameInterval);
                    this.render();
                }
            };
            this.title = document.getElementById("title");
            this.element = document.getElementById("canvas");
            this.context = this.element.getContext("2d");
            this.bounds = this.element.getBoundingClientRect();
            this.element.width = this.bounds.width;
            this.element.height = this.bounds.height;
            this.context.strokeStyle = "rgba(0, 0, 0, 0.9)";
            this.context.fillStyle = "rgba(250, 250, 250, 0.9)";
        }
        start() {
            this.startTime = Date.now();
            this.animate();
        }
    }
    exports.default = Canvas;
});
define("canvas/attractors", ["require", "exports", "canvas/canvas"], function (require, exports, canvas_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    canvas_1 = __importDefault(canvas_1);
    class Attractors extends canvas_1.default {
        constructor() {
            super();
            this.context.lineWidth = 0.05;
            this.points = [];
            this.type = Math.floor(Math.random() * 5) + 1;
            this.scale = Math.random() * 0.01;
            const attract = this.type < 4 ? 4 : Math.floor(Math.random() * (this.type === 4 ? 360 : 1000)) + 0.1;
            this.a = Math.random() * attract - (attract / 2);
            this.b = Math.random() * attract - (attract / 2);
            this.c = Math.random() * attract - (attract / 2);
            this.d = Math.random() * attract - (attract / 2);
            for (let i = 0; i < this.bounds.height; i += 0.5) {
                const x = this.type === 1 ? 0 : this.bounds.width / 2;
                const y = this.type >= 3 ? this.bounds.height / 2 : i;
                const p = {
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0
                };
                if (this.type >= 3) {
                    p.vx += (Math.random() * 360 - 180) * 0.03;
                    p.vy += (Math.random() * 360 - 180) * 0.03;
                }
                this.points.push(p);
            }
        }
        render() {
            const ctx = this.context;
            ctx.beginPath();
            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                const angle = this.getAngle(p);
                ctx.moveTo(p.x, p.y);
                p.vx += Math.cos(angle) * 0.3;
                p.vy += Math.sin(angle) * 0.3;
                p.vx *= 0.99;
                p.vy *= 0.99;
                p.x += p.vx;
                p.y += p.vy;
                ctx.lineTo(p.x, p.y);
                if (p.x > this.bounds.width)
                    p.x = 0;
                if (p.y > this.bounds.height)
                    p.y = 0;
                if (p.x < 0)
                    p.x = this.bounds.width;
                if (p.y < 0)
                    p.y = this.bounds.height;
            }
            ctx.stroke();
        }
        getAngle(point) {
            const x = (point.x - this.bounds.width / 2) * this.scale;
            const y = (point.y - this.bounds.height / 2) * this.scale;
            const x1 = Math.sin(this.a * y) + this.c * Math.cos(this.a * x);
            const y1 = Math.sin(this.b * x) + this.d * Math.cos(this.b * y);
            return Math.atan2(y1 - y, x1 - x);
        }
    }
    exports.default = Attractors;
});
define("canvas/circle", ["require", "exports", "canvas/canvas"], function (require, exports, canvas_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    canvas_2 = __importDefault(canvas_2);
    class Circle extends canvas_2.default {
        constructor() {
            super(...arguments);
            this.grow = false;
            this.radius = 1;
            this.step = 0;
        }
        render() {
            const bounds = this.bounds;
            const ctx = this.context;
            const size = Math.min(bounds.height, bounds.width);
            const speed = this.time * 0.000005;
            ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
            ctx.beginPath();
            const a = 2;
            const b = 2;
            const c = (18 * Math.sin(speed));
            const d = 3;
            const f = (g, i) => a * g(b * i / c) + g(-i / d);
            let i = size;
            while (i > 0) {
                const z = 10;
                const x = bounds.width / 2 + Math.max(size, this.radius) * (f(Math.sin, i)) / z;
                const y = bounds.height / 2 + Math.max(size, this.radius) * f(Math.cos, i) / z;
                ctx.lineTo(x, y);
                i--;
            }
            ctx.stroke();
            if (this.grow) {
                if (this.radius < 4000) {
                    this.radius += this.step;
                }
                else if (Math.random() > 0.995) {
                    this.grow = false;
                    this.step = 1 + Math.random() * 100;
                }
            }
            else if (this.radius > 1) {
                this.radius -= this.step;
            }
            else {
                if (Math.random() > 0.995) {
                    this.grow = true;
                    this.radius = size;
                    this.step = 1 + Math.random() * 100;
                }
            }
        }
    }
    exports.default = Circle;
});
define("canvas/fractalTree", ["require", "exports", "canvas/canvas"], function (require, exports, canvas_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    canvas_3 = __importDefault(canvas_3);
    class FractalTree extends canvas_3.default {
        constructor() {
            super();
            const lineSize = 5 + Math.random() * 20;
            this.lineLength = this.bounds.height / lineSize;
            this.maxAngle = 20 + Math.random() * 340;
            this.type = Math.random() > 0.5 ? "large" : "small";
            if (this.type === "small") {
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
        fractalLine(x, y, angle, iteration) {
            if (iteration > 13)
                return;
            const ctx = this.context;
            const length = this.lineLength / (this.type === "large" ? 1 : iteration);
            const radian = 0 - Math.PI / 2 + angle * Math.PI / 180;
            const cx = x + (length * Math.cos(radian));
            const cy = y + (length * Math.sin(radian));
            ctx.moveTo(x, y);
            ctx.lineTo(cx, cy);
            const adjust = this.maxAngle * Math.sin(this.time * 0.00005);
            this.fractalLine(cx, cy, angle - adjust, iteration + 1);
            this.fractalLine(cx, cy, angle + adjust, iteration + 1);
        }
    }
    exports.default = FractalTree;
});
define("init", ["require", "exports", "canvas/attractors", "canvas/circle", "canvas/fractalTree"], function (require, exports, attractors_1, circle_1, fractalTree_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    attractors_1 = __importDefault(attractors_1);
    circle_1 = __importDefault(circle_1);
    fractalTree_1 = __importDefault(fractalTree_1);
    exports.init = () => {
        const rng = Math.floor(Math.random() * 3) + 1;
        switch (rng) {
            case 3: return new fractalTree_1.default().start();
            case 2: return new circle_1.default().start();
            case 1:
            default: return new attractors_1.default().start();
        }
    };
});
//# sourceMappingURL=bundle.js.map