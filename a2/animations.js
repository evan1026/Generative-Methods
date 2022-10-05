const SWATCH_SIZE = 300;

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

let animations = [
  {
    title: "Bouncy Ball",
    description: "Just a bouncy ball.",
    isActive: true,

    setup(p) {
      this.ballRadius = 20;
      this.bounceHeight = 50;
      this.bounceSpeed = 2;
      this.minY = 10;
      this.loopTime = 3;
    },
    draw(p, t) {
      let percent = (t % this.loopTime) / this.loopTime;

      p.noStroke();
      p.background(100);

      let x = percent * p.width;
      let y = 2 * this.bounceHeight * Math.abs(Math.cos(this.bounceSpeed * percent * p.PI)) + this.minY;
      let ballHeight = this.ballRadius;
      let ballWidth = this.ballRadius;
      let ballArea = ballHeight * ballWidth;

      let bounce = false;
      if (y < ballHeight) {
        bounce = true;
        ballHeight = y;
        ballWidth = ballArea / ballHeight;
      }

      // Flip bc graphics do y starting at the top
      y = p.height - y;

      if (bounce) {
        p.stroke(0);
        p.line(x - 21, p.height - 3, x - 32, p.height - 7);
        p.line(x - 20, p.height - 5, x - 30, p.height - 10);
        p.line(x - 18, p.height - 6, x - 27, p.height - 12);
        p.line(x + 21, p.height - 3, x + 32, p.height - 7);
        p.line(x + 20, p.height - 5, x + 30, p.height - 10);
        p.line(x + 18, p.height - 6, x + 27, p.height - 12);
      }

      p.noStroke();
      p.fill(0, 75, 50);
      p.ellipse(x, y, ballWidth, ballHeight);

      if (x < this.ballRadius) {
        p.ellipse(p.width + x, y, ballWidth, ballHeight);
      } else if (x > p.width - this.ballRadius) {
        p.ellipse(x - p.width, y, ballWidth, ballHeight);
      }
    },
  },
  {
    title: "Rainbow Spiral",
    description: "I was experimenting with using the previous frame in the creation of the new frame, and after a bunch of playing I got this. It creates a lot of cool patterns that don't seem to ever repeat exactly, kind of like a kaleidoscope. If you watch for long enough you will eventually see the spiral unravel itself and then wrap back around the other way.",
    isActive: true,

    setup(p) {
      this.t = 0;
      this.numLines = 10;
    },
    draw(p, t) {
      this.t += 0.01;

      currentImg = p.get();

      p.noStroke();
      p.background(0);

      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.rotate(Math.cos(this.t / 50) / 2);
      p.translate(-p.width / 2, -p.height / 2);
      p.image(currentImg, 8 * Math.sin(this.t * 7 / 13), 8 * Math.cos(this.t * 5 / 7));
      p.pop();

      for (let i = 0; i < this.numLines; ++i) {
        let angle = 2 * this.t + 2 * p.PI * i / this.numLines;
        let x = 150 + Math.sin(angle) * 75;
        let y = 150 + Math.cos(angle) * 75;
        p.fill(360 * i / this.numLines, 100, 50);
        p.circle(x, y, 5);
      }
    },
  },
  {
    title: "Landscape Exploration",
    description:
      "Based on the Perlin Noise example - this animation color codes sections of the noise to simulate the appearance of a landscape. Watch for dark ocean trenches and snow-capped peaks.",
    isActive: true,

    setup(p) {
    },
    draw(p, t) {
      let startX = t;
      let startY = t / 2;
      let startZ = 0;

      p.background(70);
      p.fill(0);
      // How many tiles and how big are they?
      let count = 50;
      let tileSize = p.width / count;
      let noiseScale = 0.01;

      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          let x = tileSize * i;
          let y = tileSize * j;

          let noiseVal = 2 * p.noise(startX + x * noiseScale, startY + y * noiseScale, startZ) - 1;

          let hue = 0;
          let sat = 100;
          let value = 50;

          if (noiseVal < 0) {
            hue = 240;
            value = 50 + noiseVal * 50;
          } else if (noiseVal < 0.1) {
            hue = 60;
          } else if (noiseVal < 0.5) {
            hue = 120;
            value = 50 - noiseVal * 50;
          } else if (noiseVal < 0.6) {
            sat = 0;
            value = 100 - noiseVal * 100;
          } else {
            sat = 0;
            value = 100;
          }

          sat = clamp(sat, 0, 100);
          value = clamp(value, 0, 100);

          p.fill(hue % 360, sat, value, 1);
          p.noStroke();
          p.rect(x, y, tileSize * 0.9);
        }
      }
    },
  },
];
