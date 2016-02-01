import { timestamp } from './utils';

const fps    = 60,
    STEP     = 1/fps;

export default class Animator {
  constructor(canvas, objects) {
    this.sprites = objects;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.dt = 0;
    this.last = this.now = timestamp();
    this.fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  }

  update() {
    this.sprites.forEach(each => each.update(this.dt));
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clearCanvas();
    this.sprites.forEach(each => each.render(this.ctx, this.dt));
  }

  frame() {
    this.fpsmeter.tickStart();
    this.now = timestamp();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
    while(this.dt > STEP) {
      this.dt -= STEP;
      this.update(STEP);
    }
    this.render();
    this.last = this.now;
    this.fpsmeter.tick();
    requestAnimationFrame(() => this.frame(), this.canvas);
  }

  start() {
    this.frame();
  }
}
