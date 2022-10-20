/* globals Vector2D, Particle, ParticleSystem, p */

/*
 * Basic particles with an attraction force
 */

PARTICLES = 1000;
class BasicSystem extends ParticleSystem {

  static label = "🟢"; // Ignore the Glitch parse error
  static desc = "Bouncing Wave"; // Ignore the Glitch parse error


  constructor() {
    // Make what particle, and how many?
    // Try different numbers of particles
    super(BasicParticle, PARTICLES);

  }

  draw(p) {
    // A little bit of trails!
    p.background(0, 0, 50, 1)

    // The "super-class" draws the particles
    super.draw(p)

  }
}

//=========================================================================
//=========================================================================
//=========================================================================


class BasicParticle extends Particle {
  constructor(ps, index) {
    // ps: the particle system this particle belongs to
    // index: of all the particles in that system, this one's index
    super(ps, index);


    // Where should these particles start?
    // Lets use a polar coordinate to start them in a spiral
    // (and move them to the center)
    let r = 1;
    let theta = index*2*Math.PI / PARTICLES;
    this.pos.setToPolar(r, theta).add(p.width/2, p.height/2)

    this.v.setToPolar(100, theta);


    // We can also store other information about a particle, like its size or color
    this.hue = (index*360 / PARTICLES)%360
    this.radius = 3

    // Here's a new Vector2D we can store a force in so we can visualize it later
    this.attractionForce = new Vector2D()

  }

  calculateForces(p, dt) {

    if (this.pos[0] < 100) {
      this.f[0] += 100;
    }
    if (this.pos[1] < 100) {
      this.f[1] += 100;
    }
    if (Math.abs(this.pos[0] - p.width) < 100 || this.pos[0] > p.width) {
      this.f[0] -= 100;
    }
    if (Math.abs(this.pos[1] - p.height) < 100 || this.pos[1] > p.height) {
      this.f[1] -= 100;
    }
  }


  draw(p, drawDebug = false) {

    let t = p.millis() * 0.001;

    p.noStroke()
    p.fill(this.hue, 50, 50)
    p.circle(...this.pos, this.radius)
    p.fill(this.hue, 70, 60)
    p.circle(...this.pos, this.radius*.7)

    if (drawDebug) {
      if (this.f.magnitude > 0.1) {
        this.pos.drawArrow(p, this.f, {m: 1})
      }
    }

  }
}
