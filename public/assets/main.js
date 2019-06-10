var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

context.lineWidth = 0.05;

var type = Math.floor(Math.random() * 5) + 1;
var scale = Math.random() > 0.5 ? 0.01 : 0.005;
var attract = type < 4 ? 4 : Math.floor(Math.random() * (type === 4 ? 360 : 1000)) + 0.1;

var a = Math.random() * attract - (attract / 2);
var b = Math.random() * attract - (attract / 2);
var c = Math.random() * attract - (attract / 2);
var d = Math.random() * attract - (attract / 2);

// a = 1.40, b = 1.56, c = 1.40, d = -6.56
console.dir({type, attract, scale, a, b, c, d});

var points = [];
for(var i = 0; i < height; i += 0.5) {
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
}

var loop = 0;
render();

function render() {
  loop++;

  context.beginPath();
  for(var i = 0; i < points.length; i++) {
    var p = points[i];
    var value = getValue(p.x, p.y);
    p.vx += Math.cos(value) * 0.3;
    p.vy += Math.sin(value) * 0.3;

    context.moveTo(p.x, p.y);

    p.x += p.vx;
    p.y += p.vy;
    context.lineTo(p.x, p.y);

    p.vx *= 0.99;
    p.vy *= 0.99;

    if(p.x > width) p.x = 0;
    if(p.y > height) p.y = 0;
    if(p.x < 0) p.x = width;
    if(p.y < 0) p.y = height;

    // if(i == 1) o.frequency.value = p.x + p.y;
  }
  context.stroke();

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

// https://codepen.io/aqilahmisuary/pen/BjdxEE?editors=0010
const audioCtx = new AudioContext();
const o = audioCtx.createOscillator();

o.connect(audioCtx.destination);
let playing = false;
let freq = 150;

function kick() {
  var oscillator = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  var now = audioCtx.currentTime;

  oscillator.frequency.setValueAtTime(150, now);
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

function kick2() {
  console.log("kik2");
  var osc = audioCtx.createOscillator();
  var osc2 = audioCtx.createOscillator();
  var gainOsc = audioCtx.createGain();
  var gainOsc2 = audioCtx.createGain();

  osc.type = "triangle";
  osc2.type = "sine";

  gainOsc.gain.setValueAtTime(1, audioCtx.currentTime);
  gainOsc.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  gainOsc2.gain.setValueAtTime(1, audioCtx.currentTime);
  gainOsc2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  osc2.frequency.setValueAtTime(50, audioCtx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  osc.connect(gainOsc);
  osc2.connect(gainOsc2);
  gainOsc.connect(audioCtx.destination);
  gainOsc2.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc2.start(audioCtx.currentTime);

  osc.stop(audioCtx.currentTime + 0.5);
  osc2.stop(audioCtx.currentTime + 0.5);

};

var bufferSize = audioCtx.sampleRate;
var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
var output = buffer.getChannelData(0);

for (var i = 0; i < bufferSize; i++) {
  output[i] = Math.random() * 2 - 1;
}

function snare() {
  var noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  var noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 1000;
  noise.connect(noiseFilter);

  var noiseGain = audioCtx.createGain();
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);

  var oscillator = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  oscillator.type = "triangle";
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  var now = audioCtx.currentTime;
  noiseGain.gain.setValueAtTime(1, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

  oscillator.frequency.setValueAtTime(100, now);
  gain.gain.setValueAtTime(0.7, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  oscillator.start(now);
  noise.start(now);
  oscillator.stop(now + 0.2);
  noise.stop(now + 0.2);
}

document.body.onclick = () => {
  playing ? kick() : kick2();
  playing = !playing;
}