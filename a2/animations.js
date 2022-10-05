const SWATCH_SIZE = 300;

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

// Code from https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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

      // Size (in pixels) of each tile
      let count = 2;
      let noiseScale = 0.02;

      p.loadPixels();
      for (let j = 0; j < p.height / count; j++) {
        for (let i = 0; i < p.width / count; i++) {
          let noiseVal = 2 * p.noise(startX + i * noiseScale, startY + j * noiseScale, startZ) - 1;

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

          let rgb = hslToRgb((hue % 360) / 360, sat / 100, value / 100);

          // Hyperperformant loop to set pixels based on noise values
          // Doing it this way allows for much higher resolutions
          // Based on https://discourse.processing.org/t/pushing-a-7712x960-binary-image-to-p5-js-is-super-slow-is-there-a-better-way/371
          let d = p.pixelDensity();
          for (let y = j * count; y < (j + 1) * count; ++y) {
            for (let x = i * count ; x < (i + 1) * count; ++x) {
              for (let subpixelY = 0; subpixelY < d; ++subpixelY) {
                for (let subpixelX = 0; subpixelX < d; ++subpixelX) {
                  // loop over
                  index = 4 * ((y * d + subpixelY) * p.width * d + (x * d + subpixelX));
                  p.pixels[index] = rgb[0];
                  p.pixels[index+1] = rgb[1];
                  p.pixels[index+2] = rgb[2];
                  p.pixels[index+3] = 255;
                }
              }
            }
          }
        }
      }
      p.updatePixels();
    },
  },
];
