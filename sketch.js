let osc, delay, env, fft;
let isPlaying = false;

function setup() {
  let cnv = createCanvas(400, 400);
  background(14, 14, 18);

  osc = new p5.Oscillator('sawtooth');
  osc.amp(0);

  env = new p5.Envelope();
  env.setADSR(0.02, 0.1, 0.7, 0.5);
  env.setRange(0.72, 0);

  delay = new p5.Delay();
  osc.start();
  delay.process(osc, 0.12, 0.7, 2300);

  fft = new p5.FFT(0.85, 128);

  cnv.mousePressed(oscStart);
  cnv.mouseReleased(oscStop);
  cnv.mouseOut(oscStop);
}

function oscStart() {
  userStartAudio();
  isPlaying = true;
  env.play(osc);
}

function oscStop() {
  isPlaying = false;
  env.triggerRelease(osc);
}

function draw() {
  let freq  = map(mouseY, height, 0, 220, 1100);
  let dtime = map(mouseX, 0, width, 0.05, 0.55);

  osc.freq(freq);
  delay.delayTime(dtime);

  document.getElementById('disp-freq').textContent  = nf(freq, 1, 0) + ' Hz';
  document.getElementById('disp-delay').textContent = nf(dtime, 1, 2) + ' s';

  background(14, 14, 18, isPlaying ? 30 : 80);

  let waveform = fft.waveform();

  if (isPlaying) {
    stroke(200, 255, 0, 25);
    strokeWeight(6);
    noFill();
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, height * 0.15, height * 0.85);
      vertex(x, y);
    }
    endShape();
  }

  stroke(isPlaying ? color(200, 255, 0, 200) : color(50, 50, 60, 180));
  strokeWeight(1.5);
  noFill();
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.15, height * 0.85);
    vertex(x, y);
  }
  endShape();

  if (!isPlaying) {
    noStroke();
    fill(50, 50, 60);
    textFont('monospace');
    textSize(11);
    textAlign(CENTER, CENTER);
    text('click to play', width / 2, height / 2);
  }
}
