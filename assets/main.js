var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

context.lineWidth = 0.1;

var type = Math.floor(Math.random() * 4) + 1;
var attract = type === 4 ? 360 : 4;
var scale = Math.random() > 0.5 ? 0.01 : 0.005;

var a = Math.random() * attract - (attract / 2);
var b = Math.random() * attract - (attract / 2);
var c = Math.random() * attract - (attract / 2);
var d = Math.random() * attract - (attract / 2);

// a = 1.40, b = 1.56, c = 1.40, d = -6.56
console.log(type, scale, a, b, c, d);

var points = [];
for(var i = 0; i < height; i += 1) {
  var x = type === 1 ? 0 : width / 2;
  var y = type >= 3 ? height / 2 : i;
  var p = {
    x: x,
    y: y,
    vx: 0,
    vy: 0
  };

  if(type >= 3) {
    p.vx += (Math.random() * 360 - 180) * 0.03;
    p.vy += (Math.random() * 360 - 180) * 0.03;
  }

  points.push(p);
};

var loop = 0;
render();

function render() {
  loop++;

  for(var i = 0; i < points.length; i++) {
    var p = points[i];
    var value = getValue(p.x, p.y);
    p.vx += Math.cos(value) * 0.3;
    p.vy += Math.sin(value) * 0.3;

    context.beginPath();
    context.moveTo(p.x, p.y);

    p.x += p.vx;
    p.y += p.vy;
    context.lineTo(p.x, p.y);
    context.stroke();

    p.vx *= 0.99;
    p.vy *= 0.99;

    if(p.x > width) p.x = 0;
    if(p.y > height) p.y = 0;
    if(p.x < 0) p.x = width;
    if(p.y < 0) p.y = height;
  }

  if(loop < 10000) {
    requestAnimationFrame(render);
  }
  else {
    console.log("STOPPED");
  }
}

function getValue(x, y) {
  // clifford attractor
  // http://paulbourke.net/fractals/clifford/

  // scale down x and y
  x = (x - width / 2) * scale;
  y = (y - height / 2) * scale;

  // attactor gives new x, y for old one.
  var x1 = Math.sin(a * y) + c * Math.cos(a * x);
  var y1 = Math.sin(b * x) + d * Math.cos(b * y);

  // x1 = d * Math.sin(a * x) - Math.sin(b * y)
  // y1 = c * Math.cos(a * x) + Math.cos(b * y)

  // find angle from old to new. that's the value.
  return Math.atan2(y1 - y, x1 - x);
}
