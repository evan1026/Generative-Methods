/* globals Vector2D, Particle, ParticleSystem, p */

/*
 * Basic particles with an attraction force
 */

class AntSystem extends ParticleSystem {

  static label = "🐜"; // Ignore the Glitch parse error
  static desc = "You've got ants."; // Ignore the Glitch parse error


  constructor() {
    super(AntParticle, 100);
  }

  draw(p) {
    p.background(0, 0, 100, 1);
    this.debugDraw = DEBUG_DRAW_EL.checked

    // The "super-class" draws the particles
    super.draw(p)

  }
}

//=========================================================================
//=========================================================================
//=========================================================================

let NOISE_SCALE = 0.05;
let WIND_FORCE = 100;

class AntParticle extends Particle {
  constructor(ps, index) {
    super(ps, index);

    let r = 5 + index;
    let theta = Math.random() * 2 * Math.PI;
    this.pos.setToPolar(r, theta).add(p.width/2, p.height/2);

    this.hue = (index * 75) % 360;
    this.radius = 3;
    this.mass = 1;

    this.ps = ps;

  }

  calculateForces(p, dt) {
    this.f.setTo((Math.random() - 0.5) * WIND_FORCE, (Math.random() - 0.5) * WIND_FORCE);
    let center = new Vector2D(p.width/2, p.height/2);
    this.f.add(this.pos.getForceTowardsPoint(center, 1, { falloff:1, startRadius: 200 } ));
  }

  draw(p, drawDebug = false) {

    let t = p.millis() * 0.001;


    if (drawDebug) {
      this.pos.drawArrow(p, this.v, {m: 5, color: [0, 0, 0]});
    } else {
    }


    p.noStroke()
    let circlePos = new Vector2D(...this.pos);
    p.fill(this.hue, 50, 30)
    p.circle(...circlePos, this.radius)

    p.stroke(this.hue, 50, 30);
    let theta = Math.atan2(this.v[1], this.v[0]);
    let out = Vector2D.polar(6, theta + Math.PI / 2).add(circlePos);
    p.line(...this.pos, ...out);
    out = Vector2D.polar(6, theta - Math.PI / 2).add(circlePos);
    p.line(...this.pos, ...out);

    p.noStroke()
    circlePos.addMultiple(this.v, 1.5 * this.radius / this.v.magnitude);
    p.fill(this.hue, 50, 30)
    p.circle(...circlePos, this.radius)

    p.stroke(this.hue, 50, 30);
    theta = Math.atan2(this.v[1], this.v[0]);
    out = Vector2D.polar(6, theta + Math.PI / 2).add(circlePos);
    p.line(...this.pos, ...out);
    out = Vector2D.polar(6, theta - Math.PI / 2).add(circlePos);
    p.line(...this.pos, ...out);

    p.noStroke()
    circlePos.addMultiple(this.v, -3 * this.radius / this.v.magnitude);
    p.fill(this.hue, 50, 30)
    p.circle(...circlePos, this.radius)

    p.stroke(this.hue, 50, 30);
    theta = Math.atan2(this.v[1], this.v[0]);
    out = Vector2D.polar(6, theta + Math.PI / 2).add(circlePos);
    p.line(...this.pos, ...out);
    out = Vector2D.polar(6, theta - Math.PI / 2).add(circlePos);
    p.line(...this.pos, ...out);
  }
}
