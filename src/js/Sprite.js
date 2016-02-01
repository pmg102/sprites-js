
export default class Sprite {
	constructor(cfg) {
	  this.t = 0;
	  this.x = cfg.x || 0;
	  this.y = cfg.y || 0;
	  this.dx = cfg.dx || 0;
	  this.dy = cfg.dy || 0;
	  this.ddx = cfg.ddx || 0;
	  this.ddy = cfg.ddy || 0;
	  this.color = cfg.color || '#fff';
	  this.height = cfg.height || 1;
	  this.width = cfg.width || 1;
	  this.lifetime = cfg.lifetime;

	  Sprite.objects.push(this);
	}

	update(dt) {
	  this.x  = this.x  + (dt * this.dx);
	  this.y  = this.y  + (dt * this.dy);
	  this.dx = this.dx + (dt * this.ddx);
	  this.dy = this.dy + (dt * this.ddy);

	  this.t += dt;
	  if (this.lifetime && this.t > this.lifetime) {
	    delete Sprite.objects[Sprite.objects.indexOf(this)];
	  }
	}

	render(ctx, dt) {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(this.x + (this.dx * dt), this.y + (this.dy * dt), this.width, this.height);
	}

}

Sprite.objects = [];