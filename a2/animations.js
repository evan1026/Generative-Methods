const SWATCH_SIZE = 300;

let animations = [
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
];
