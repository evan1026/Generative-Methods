/* globals Vector2D, Particle, ParticleSystem, p */

/*
 * Wind-driven particles that respond to different kinds of wander forces
 * Which looks the most like "leaves"?
 */

class WindSystem extends ParticleSystem {
  static label = "🐟"; // Ignore the Glitch parse error
  static desc = "Fish swimming in water"

  constructor() {
    // Make wind particles
    super(WindParticle, 100);
    this.windScale = 0.001;
  }

  draw(p) {

    p.background(240, 50, 50)

    // The "super-class" draws the particles
    super.draw(p)
  }

  getWindAt(x, y) {
    let windTheta = 10 * p.noise(x * this.windScale, y * this.windScale);
    let windSpeed = 10;
    return Vector2D.polar(windSpeed, windTheta);
  }
}

//=========================================================================
//=========================================================================
//=========================================================================


class WindParticle extends Particle {
  constructor(ps, index) {
    super(ps, index);

    this.angle = 0;

    this.hue = Math.random()*60 + 120;

    // Put these particles somewhere randomly on screen
    this.pos.setToRandom(0, p.width, 0, p.height); // Set to a random (x0,x1,y0,y1)
    this.v.setTo(0, 100);

    // Store a wind force so we can visualize it
    this.windForce = new Vector2D();
  }

  calculateForces(p, dt) {
    let t = p.millis() * 0.001;

    // Apply some "drag" by making the velocity smaller
    this.v.mult(0.99);

    let windX = this.ps.windScale * this.pos[0];
    let windY = this.ps.windScale * this.pos[1];

    // If we do *both*, they clump less!
    let windDir = 20*p.noise(windX, windY, t*.1)

    this.angle = Math.sin(this.pos.magnitude / 10) / 10;

    this.windForce.setToPolar(100, windDir);
    this.f.add(this.windForce);
  }

  move(p, dt) {
    // Call the original move function
    super.move(p, dt);

    this.pos.wrapX(0, p.width);
    this.pos.wrapY(0, p.height);

  }

  draw(p, drawDebug = false) {
    let t = p.millis() * 0.001;

    // FANCY DRAWING!
    // Move to where this particle is
    p.push();
    p.translate(...this.pos);

    // Align with the current
    p.rotate(this.v.angle + this.angle);
    p.fill(
      this.hue,
      50 + 50 * p.noise(this.idNumber + t + 50),
      30 + 30 * p.noise(this.idNumber + t + 100)
    );

    let leafWidth = 6
    let leafLength = 20
    p.beginShape();
    p.vertex(-leafLength*.5, -leafWidth);
    p.vertex(-leafLength*.5, -leafWidth);
    p.vertex(leafLength * .16, leafWidth);
    p.curveVertex(leafLength*.5, 0);
    p.curveVertex(leafLength * .16, -leafWidth);
    p.vertex(-leafLength*.5, leafWidth);
    p.vertex(-leafLength*.5, leafWidth);
    p.endShape(p.CLOSE);
    p.pop();

    if (drawDebug) {
      this.pos.drawArrow(p, this.windForce, { m: 0.2 });
    }
  }
}
