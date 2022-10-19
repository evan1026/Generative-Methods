/* globals Vector2D, Particle, ParticleSystem, p */

/*
 * Basic particles with an attraction force
 */

class GravitySystem extends ParticleSystem {

  static label = "🌌"; // Ignore the Glitch parse error
  static desc = "Gravity-based system with stable orbits thanks to Verlet Integration"; // Ignore the Glitch parse error


  constructor() {
    super(GravityParticle, 6);

    this.gravity = 1;
    this.prevDebugDraw = false;

    p.background(0, 0, 0, 1);
  }

  draw(p) {
    let debugDraw = DEBUG_DRAW_EL.checked;

    if (this.prevDebugDraw) {
      p.background(0, 0, 0, 1);
    } else {
      p.background(0, 0, 0, 0.05);
    }

    this.prevDebugDraw = debugDraw;

    // The "super-class" draws the particles
    super.draw(p)

  }
}

//=========================================================================
//=========================================================================
//=========================================================================

class GravityParticle extends Particle {
  constructor(ps, index) {
    super(ps, index);

    if (index == 0) {
      this.pos.setTo(p.width / 2, p.height / 2);
      this.hue = 60;
      this.radius = 10;
      this.mass = 300000;
    } else {
      let r = 30 + index * 10;
      let theta = Math.random() * 2 * Math.PI;
      this.pos.setToPolar(r, theta).add(p.width/2, p.height/2);

      this.v.setToPolar(r * 10, theta + Math.PI / 2);

      this.hue = (index * 100) % 360;
      this.radius = 2;
      this.mass = 1;
    }

    this.ps = ps;

  }

  calculateForces(p, dt) {
    this.ps.particles.forEach((particle) => {
      if (particle === this) {
        return;
      }

      let towardsVector = Vector2D.sub(particle.pos, this.pos);
      let r = towardsVector.magnitude;
      towardsVector.constrainMagnitude(1, 1);

      let gravityStrength = this.ps.gravity * this.mass * particle.mass / r; // 2D system means gravity should be linear
      this.f.addMultiple(towardsVector, gravityStrength);
    });
  }

  move(p, dt) {
    // Verlet integration to make movement stable

    if (dt === 0) {
      return; // app.js makes dt 0 the first time which causes us to do 0/0 which leads to NaN poisoning
    }

    dt = dt / 5;

    if (this.prevPos === undefined) {
      // Regular integration for the first step so we can get our prev values
      this.prevPos = new Vector2D(...this.pos);
      this.prevDt = dt;
      this.pos.addMultiple(this.v, dt)
      this.v.addMultiple(this.f, dt)
    }

    let currentPos = new Vector2D(...this.pos);

    let accel = new Vector2D(...this.f);
    accel.mult(1 / this.mass);

    let posDiff = Vector2D.sub(this.pos, this.prevPos);
    posDiff.mult(dt / this.prevDt);

    accel.mult((dt + this.prevDt) / 2 * dt);

    this.pos.add(posDiff);
    this.pos.add(accel);

    this.v.setTo(this.pos[0] - currentPos[0], this.pos[1] - currentPos[1]);

    this.prevPos = currentPos;
    this.prevDt = dt;
  }

  draw(p, drawDebug = false) {

    let t = p.millis() * 0.001;

    p.noStroke()
    p.fill(this.hue, 50, 50)
    p.circle(...this.pos, this.radius)
    p.fill(this.hue, 70, 60)
    p.circle(...this.pos, this.radius*.7)

    if (drawDebug) {
      this.pos.drawArrow(p, this.f, {m: 0.01, color: [0, 0, 100]});
      this.pos.drawArrow(p, this.v, {m: 10, color: [50, 50, 50]});
    }

  }
}