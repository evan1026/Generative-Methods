const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

// Current tool settings
let p; // Processing object, accessible from anywhere
let color0 = [160, 100, 50];
let color1 = [320, 100, 50];
let brushSize = 1;

function startDrawing(p) {
  // Change if you want to start with a different background,
  // or even *no background!*
  p.background(0, 0, 100);
}

let brushes = [
  // Your brushes here!
  //======================================================
  {
    label: "🕳",
    isActive: true,
    description: "Eraser",

    setup() {
      p.loadPixels();
      this.pixels = [...p.pixels];  // Save the original canvas so we can continually redraw over it
    },

    draw() {
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      this.pixels.forEach((value, index) => {
        p.pixels[index] = value;
      });
      p.updatePixels();

      if (p.mouseIsPressed) {
        p.stroke(0, 0, 100);
        p.strokeWeight(brushSize * 100 + 2);
        p.line(x, y, x1, y1);

        p.loadPixels();
        p.pixels.forEach((value, index) => {
          this.pixels[index] = value;
        });
      }

      p.stroke(0, 0, 0);
      p.strokeWeight(1);
      p.fill(0, 0, 100);
      p.ellipse(x, y, (brushSize * 100 + 2) / 2);
    },
  },

  {
    label: "⚫️",
    isActive: true,
    description: "Circle Tool. Click and drag from the center to the edge of the circle.",

    mousePressed() {
      p.loadPixels();
      this.pixels = [...p.pixels];  // Save the original canvas so we can continually redraw over it
      this.center = [p.mouseX, p.mouseY];
    },

    mouseReleased() {
      this.pixels = [];  // Throw away the old canvas just to save some memory
    },

    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;

      let dx = x - this.center[0];
      let dy = y - this.center[1];
      let radius = Math.sqrt(dx * dx + dy * dy);

      p.loadPixels();
      this.pixels.forEach((value, index) => {
        p.pixels[index] = value;
      });
      p.updatePixels();

      p.stroke(...color0);
      p.fill(...color1);
      p.strokeWeight(brushSize * 10 + 2);

      p.ellipse(this.center[0], this.center[1], radius);
    },
  },
  {
    label: "➰",
    isActive: true,
    description: "Smooth Shape Tool",

    mousePressed() {
      p.loadPixels();
      this.pixels = [...p.pixels];  // Save the original canvas so we can continually redraw over it
      this.points = [];
    },

    mouseReleased() {
      this.pixels = [];  // Throw away the old canvas just to save some memory
    },

    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;
      this.points.push([x, y]);

      p.loadPixels();
      this.pixels.forEach((value, index) => {
        p.pixels[index] = value;
      });
      p.updatePixels();

      p.stroke(...color0);
      p.fill(...color1);
      p.strokeWeight(brushSize * 10 + 2);

      p.beginShape();
      this.points.forEach(point => {
        p.curveVertex(point[0], point[1]);
      });
      p.endShape();
    },
  },
  {
    label: "💥",
    isActive: true,
    description: "Firecracker Brush",

    setup() {
      this.points = [];
      this.gravity = 10000;
      this.prevT = p.millis() * 0.001;
      this.colorProgression = [[60, 100, 50], [45, 100, 50], [30, 100, 50], [15, 100, 50], [0, 100, 50], [0, 100, 50], [0, 50, 50], [0, 25, 50], [0, 0, 50]];
    },

    mouseDragged() {
    },

    draw() {
      if (p.mouseIsPressed) {
        let x = p.mouseX;
        let y = p.mouseY;

        let xVel = 1000 * (Math.random() * 2 - 1);
        let yVel = -1500 * Math.random();
        let pt = [x, y, xVel, yVel];

        pt.startingValues = [x, y, xVel, yVel];
        pt.colorIndex = 0;
        pt.spawnedChild = false;
        pt.strokeWidth = 1;

        // How long does this dot live?
        pt.totalLifespan = 10 + Math.random()*30;

        pt.lifespan = pt.totalLifespan
        this.points.push(pt);
      }

      let t = p.millis() * .001;
      let dt = t - this.prevT;

      this.prevT = t;

      let newPts = [];

      // Each point keeps drawing itself, as long as it has a lifespan
      this.points.forEach((pt, index) => {
        pt.lifespan--;

        if (pt.lifespan > 0) {

          let prevX = pt[0];
          let prevY = pt[1];

          pt[3] += this.gravity * dt;

          pt[0] += pt[2] * dt;
          pt[1] += pt[3] * dt;

          p.stroke(...this.colorProgression[pt.colorIndex]);
          p.strokeWeight(pt.strokeWidth);
          p.line(pt[0], pt[1], prevX, prevY);
        }

        if (pt.colorIndex < this.colorProgression.length - 1 && !pt.spawnedChild) {
          let newPt = [pt.startingValues[0], pt.startingValues[1], pt.startingValues[2], pt.startingValues[3]];
          newPt.startingValues = [pt.startingValues[0], pt.startingValues[1], pt.startingValues[2], pt.startingValues[3]];
          newPt.colorIndex = pt.colorIndex + 1;
          newPt.spawnedChild = false;
          newPt.totalLifespan = pt.totalLifespan + 0.5;
          newPt.lifespan = newPt.totalLifespan;
          newPt.strokeWidth = pt.strokeWidth + 0.25;

          pt.spawnedChild = true;

          newPts.push(newPt);
        }
      });

      this.points = this.points.filter(point => point.lifespan > 0);
      this.points = this.points.concat(newPts);
    },
  },

  //======================================================
  // Example brushes
  {
    label: "✏️",
    isActive: false,
    description:
    "A basic paint brush.  It uses the color0 and size properties set by the sliders.  It is a 'discrete' brush",

    // Options:
    // setup (when tool is selected),
    // draw (every frame, even if the mouse isn't down),
    // mouseDragged (when the mouse is dragged)
    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;
      let r = brushSize * 5 + 1;

      // Remove the stroke and set the color to the current color
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2]);

      p.circle(x, y, r);
    },
  },

  //======================================================
  {
    label: "│",
    isActive: false,
    description:
    "A basic line brush.  It uses pmouseX,pmouseY to draw to where the last mouse position was.  It is a *continuous* brush",

    // Using "draw" because pmouseX only remembers the mouse pos
    // each "frame" which is slightly different than
    // each time we drag the mouse
    draw() {
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      if (p.mouseIsPressed) {
        // Another way to say p.stroke(color0[0], color0[1], color0[2]);
        p.stroke(...color0);

        p.strokeWeight(brushSize * 10 + 2);
        p.line(x, y, x1, y1);
      }
    },
  },

  //======================================================

  {
    label: "🧵",
    isActive: false,
    description: "A continuous brush using curves",

    mousePressed() {
      //       We need to store the points
      this.points = [];
      // We can start storing a new set of points when the mouse is pressed
    },

    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;
      // Add a new point to the beginning of this list
      this.points.unshift([x, y]);

      p.noFill();
      p.stroke(color0[0], color0[1], color0[2] + 50 * Math.random(), 0.8);
      p.beginShape();

      // Take every...10th? point
      // What happens if you change this
      this.points
        .filter((pt, index) => index % 10 == 0)
        .forEach(([x, y]) => {
          let dx = 0;
          let dy = 0;

          //         What happens if we offset the x and y we are drawing?
          // dx = Math.random()*100
          // dy = Math.random()*10

          p.curveVertex(x + dx, y + dy);
        });

      p.endShape();
    },
  }, //======================================================
  {
    label: "🌱",
    isActive: false,
    description: "Growing brush, leaves behind a trail that .... moves each frame!",

    setup() {
      // Store all the poitns this brush has made
      this.points = [];
    },

    mouseDragged() {
      // Every time we move
      // Add a new point to the beginning of this list
      let x = p.mouseX;
      let y = p.mouseY;
      let pt = [x, y];

      // How long does this dot live?
      pt.totalLifespan = 10 + Math.random()*10;

      // Try a longer lifespan 😉
      // pt.totalLifespan = 10 + Math.random()*100;

      pt.lifespan = pt.totalLifespan
      this.points.push(pt);

      p.circle(x, y, 4);
    },

    draw() {

      let radius = 5
      let t = p.millis() * .001;

      // Each point keeps drawing itself, as long as it has a lifespan
      this.points.forEach((pt, index) => {
        //
        pt.lifespan--;

        if (pt.lifespan > 0) {

          let pctLife = pt.lifespan/pt.totalLifespan
          let r = radius*.5
          let theta = p.noise(index, t*.1)*100;

          // Grow in some direction
          pt[0] += r * Math.cos(theta);
          pt[1] += r * Math.sin(theta);

          p.noStroke()
          p.fill(color0[0], color0[1], color0[2]*.1, .1)
          p.circle(...pt, (pctLife)*radius*2);

          p.fill(color0[0] + p.noise(index)*40, color0[1], color0[2]*(1 - pctLife))

          //           Get smaller at the end of your life
          p.circle(...pt, (pctLife**.2)*radius);
        }
      });
    },
  },
];
