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

    draw() {
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      if (p.mouseIsPressed) {
        p.stroke(0, 0, 100);
        p.strokeWeight(brushSize * 100 + 2);
        p.line(x, y, x1, y1);
      }
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
      p.pixels = [...this.pixels];
      p.updatePixels();

      p.stroke(...color0);
      p.fill(...color1);
      p.strokeWeight(brushSize * 100 + 2);

      p.beginShape();
      this.points.forEach(point => {
        p.curveVertex(point[0], point[1]);
      });
      p.endShape();
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
