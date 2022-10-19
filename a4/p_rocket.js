/* globals Vector2D, Particle, ParticleSystem, p */

/*
 * Local-frame physics
 * and trails!
 * Would work great with a curve behind it instead.....
 */

class RocketSystem extends ParticleSystem {
  static label = "🚀"; // Ignore the Glitch parse error

  constructor() {
    super(RocketParticle, 5);

    this.windScale = 0.001;
  }

  draw(p) {
    // Draw a background
    p.background(190, 40, 80);
    // The "super-class" draws the particles
    super.draw(p);
  }
}

//=========================================================================
//=========================================================================
//=========================================================================

class RocketParticle extends Particle {
  constructor(ps, index) {
    super(ps, index);

    this.angle = Math.random() * 200;
    this.hue = Math.random() * 60;

    // Put these particles somewhere randomly on screen
    this.pos.setToRandom(0, 0, p.width, p.height); // Set to a random (x0,x1,y0,y1)
    this.v.setTo(0, 100);
    
    // Store some values that we can use
    // to *both* set forces, and draw 
    // so that we visually represent the forces
    this.thrusterStrength = 1;
    this.turnStrength = 0.1;
    this.flameAnimation = 0.1;
    
    // Store forces so we can debug-draw them
    this.thrustForce = new Vector2D();
    this.turnForce = new Vector2D();
    
    // Store a trail of past-positions
    this.trail = [];
  }

  calculateForces(p, dt) {
    let t = p.millis() * 0.001;
    // The ship's angle is the same as its velocity
    //. True of rockets, may not be true of everything!

    this.angle = this.v.angle;
    let angle = this.angle;

    // Set the amount of turn and thruster force
    this.turnStrength = p.noise(t * 0.2, this.idNumber) - 0.5;
    this.thrusterStrength = 2 * p.noise(t * 0.4, this.idNumber) ** 4;

    if (p.keyIsPressed) {
      if (p.keyCode === p.RIGHT_ARROW) this.turnStrength = 0.3;
      if (p.keyCode === p.LEFT_ARROW) this.turnStrength = -0.3;
      if (p.keyCode === p.UP_ARROW) this.thrusterStrength = 0.5;
    }

    let multiplier = 900;
    this.thrustForce.setToPolar(this.thrusterStrength * multiplier, this.angle);
    this.turnForce.setToPolar(
      this.turnStrength * multiplier,
      this.angle + Math.PI / 2
    );
    this.f.add(this.turnForce);
    this.f.add(this.thrustForce);

    this.v.mult(0.98);
  }

  move(p, dt) {
    // Call the original move function
    super.move(p, dt);

    // Then wrap around the screen
    this.pos.wrapX(0, p.width);
    this.pos.wrapY(0, p.height);

    // Every time we move, add to our trail
    this.trail.push(this.pos.clone());
    this.trail = this.trail.slice(-25);
  }

  draw(p, drawDebug = false) {
    let t = p.millis() * 0.001;

    // Draw the trail
    p.noStroke();
    p.fill(0, 0, 0, 0.1);

    // Draw every third trail poof
    this.trail
      .filter((pt, index) => index % 3 == 0)
      .forEach((pt, index) => {
        // Draw the circle, with a little offset wiggle
        p.circle(
          pt[0] + 10 * p.noise(pt[0]) - 5,
          pt[1] + 10 * p.noise(pt[0]) - 5,
          5 + -0.1 * index
        );
      });

    // Move to the rocket's location
    p.push();
    p.translate(...this.pos);
    p.rotate(this.v.angle);

    // Rocket body
    p.noStroke();
    p.rectMode(p.CENTER);
    p.stroke(0, 0, 100, 1);
    p.fill(0, 0, 50);
    p.rect(10, 0, 15, 10);
    p.ellipse(30, 0, 22, 5);

    // Fins
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(20, 0);
    p.fill(0, 0, 70);
    p.vertex(0, -40 * this.turnStrength);
    p.endShape();

    // Flamejet
    let cycle = this.flameAnimation;
    let flameCount = 7;
    p.scale(this.thrusterStrength, 0.6 + this.thrusterStrength * 0.4);
    for (var i = 0; i < flameCount; i++) {
      let pct = ((i + cycle * 10) % flameCount) / flameCount;
      let r = (0.3 + Math.sin(pct * Math.PI)) * (1 - pct);
      p.fill(50 - pct * 50, 100, 50);
      p.noStroke();
      p.ellipse(-pct * 100, pct * 3 * Math.sin(i * 3 + cycle), r * 20, r * 8);
    }

    p.pop();

    if (drawDebug) {
      this.pos.drawArrow(p, this.thrustForce, { m: 0.2, color: [40, 100, 50] });
      this.pos.drawArrow(p, this.turnForce, { m: 0.2, color: [190, 100, 50] });
    }
  }
}
