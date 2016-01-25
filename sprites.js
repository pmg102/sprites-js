function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

//-------------------------------------------------------------------------
// GAME CONSTANTS AND VARIABLES
//-------------------------------------------------------------------------

var MAP      = { tw: 64, th: 48 },
    TILE     = 32,
    GRAVITY  = 9.8 * 6, // default (exagerated) gravity
    COLOR    = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
    COLORS   = [ COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ],
    KEY      = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    
var fps      = 60,
    step     = 1/fps,
    canvas   = document.getElementById('canvas'),
    ctx      = canvas.getContext('2d'),
    width    = canvas.width  = MAP.tw * TILE,
    height   = canvas.height = MAP.th * TILE,
    sprites  = [];

function Sprite(cfg) {
  this.t = 0;
  this.x = cfg.x || 0;
  this.y = cfg.y || 0;
  this.dx = cfg.dx || 0;
  this.dy = cfg.dy || 0;
  this.ddx = cfg.ddx || 0;
  this.ddy = cfg.ddy || 0;
  this.color = cfg.color || COLOR.YELLOW;
  this.height = cfg.height || 1;
  this.width = cfg.width || 1;
  this.lifetime = cfg.lifetime;

  sprites.push(this);
}

Sprite.prototype.update = function(dt) {
  this.x  = this.x  + (dt * this.dx);
  this.y  = this.y  + (dt * this.dy);
  this.dx = this.dx + (dt * this.ddx);
  this.dy = this.dy + (dt * this.ddy);

  this.t += dt;
  if (this.lifetime && this.t > this.lifetime) {
    delete sprites[sprites.indexOf(this)];
  }
}

Sprite.prototype.render = function(ctx, dt) {
  ctx.fillStyle = COLOR.YELLOW;
  ctx.fillRect(this.x + (this.dx * dt), this.y + (this.dy * dt), this.width, this.height);
}

function update(dt) {
  sprites.forEach(function (each) { each.update(dt); })
}

function render(ctx, frame, dt) {
  ctx.clearRect(0, 0, width, height);
  sprites.forEach(function (each) { each.render(ctx, dt); })
}

var counter = 0, dt = 0, now,
    last = timestamp(),
    fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });

function frame() {
  fpsmeter.tickStart();
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while(dt > step) {
    dt = dt - step;
    update(step);
  }
  render(ctx, counter, dt);
  last = now;
  counter++;
  fpsmeter.tick();
  requestAnimationFrame(frame, canvas);
}

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

frame();

function emitParticle() {
  new Sprite({
    x: ship.x + ship.width / 2,
    y: ship.y + ship.height,
    dx: -50 + 100 * Math.random(),
    dy: ship.dy + 100,
    ddy: 600,
    width: 0.5 + Math.random() * 3,
    height: 0.5 + Math.random() * 3,
    color: COLORS[1 + (Math.random() * (COLORS.length - 1))],
    lifetime: 0.5 + Math.random() / 2
  });
}

var ship = new Sprite({
  x:100,
  y:100,
  ddy: 600,
  width: 30,
  height: 100,
  color: COLOR.YELLOW
});

var interval;

function onkey(ev, key, down) {
  switch(key) {
    case KEY.UP:
      if (down && !interval) {
        ship.ddy = -800;
        interval = setInterval(emitParticle, 1);
      }
      else if (!down && interval) {
        ship.ddy = 600;
        clearInterval(interval);
        interval = null;
      }
      ev.preventDefault();
      return false;
    case KEY.SPACE:
      if (down) {
        new Sprite({
          x: ship.x + ship.width,
          y: ship.y + ship.height/3,
          dx: 5000,
          width: ship.width,
        });
      }
      ev.preventDefault();
      return false;
  }
}



