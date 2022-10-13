const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

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

  //======================================================
  //======================================================
  // Example brushes
  {
    label: "✏️",
    isActive: true,
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
    label: "〰",
    isActive: true,
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
    label: "🖌",
    isActive: true,
    description:
    "Complicated discrete brush. It uses the color0, color1, and size properties set by the sliders",

    setup() {
      //       Count how many times we've drawn
      this.drawCount = 0;
    },

    // Options: setup (when tool is selected), draw (every frame),
    mouseDragged() {
      //       Here I am keeping track of both the current time, and how many times this brush has drawn

      let t = p.millis() * 0.001; // Get the number of seconds
      this.drawCount += 1;
      let x = p.mouseX;
      let y = p.mouseY;

      //       Controllable brush size
      let r = brushSize * 10 + 10;

      //       Change the brush by how many we have drawn
      // r *= 0.5 + p.noise(this.drawCount * 0.1);
      //       Change the brush by the current time
      // r *= 0.5 + p.noise(t * 10);

      //       Shadow
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2] * 0.2, 0.1);
      p.circle(x, y + r * 0.15, r * 1.1);

      // Big circle
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2]);
      p.circle(x, y, r);

      // Small contrast circle
      p.noStroke();
      p.fill(color1[0], color1[1], color1[2]);
      p.circle(x - r * 0.1, y - r * 0.1, r * 0.7);

      //       Highlight
      p.noStroke();
      p.fill(color1[0], color1[1], color1[2] * 1.4);
      p.circle(x - r * 0.15, y - r * 0.15, r * 0.5);
    },
  },

  //======================================================

  {
    label: "💦",
    description:
    "Scatter brush, places lots of dots in both colors (discrete!)",
    isActive: true,

    mouseDragged() {
      let t = p.millis() * 0.001;
      let x = p.mouseX;
      let y = p.mouseY;

      let brushSize = 20;
      let count = 6;

      // Scale the cluster by how far we have moved since last frame
      // the "magnitude" of the (movedX, movedY) vector
      let distanceTravelled = p.mag(p.movedX, p.movedY);
      brushSize = distanceTravelled * 2 + 10;

      // I often draw a shadow behind my brush,
      // it helps it stand out from the background
      p.noStroke();
      p.fill(0, 0, 0, 0.01);
      p.circle(x, y, brushSize * 2);

      // Draw some dots

      for (var i = 0; i < count; i++) {
        // Offset a polar
        let r = brushSize * Math.random();
        let theta = Math.random() * Math.PI * 2;

        let brightnessBump = Math.random() * 50 - 20;
        brightnessBump = 20 * Math.sin(t * 7);

        let opacity = Math.random() * 0.5 + 0.2;
        if (Math.random() > 0.5)
          p.fill(color0[0], color0[1], color0[2] + brightnessBump, opacity);
        else p.fill(color1[0], color1[1], color1[2] + brightnessBump, opacity);

        let circleSize = (Math.random() + 1) * brushSize * 0.2;

        let x2 = x + r * Math.cos(theta);
        let y2 = y + r * Math.sin(theta);
        p.circle(x2, y2, circleSize);
      }
    },
  },

  //======================================================

  {
    label: "💕",
    description: "Emoji scatter brush",
    isActive: true,

    mouseDragged() {
      let hearts = ["💙", "🧡", "💛", "💖", "💚", "💜"];
      let x = p.mouseX;
      let y = p.mouseY;

      let brushSize = 20;
      let count = 2;

      // Scale the cluster by how far we have moved since last frame
      // the "magnitude" of the (movedX, movedY) vector
      let distanceTravelled = p.mag(p.movedX, p.movedY);
      brushSize = distanceTravelled * 2 + 10;

      // I often draw a shadow behind my brush,
      // it helps it stand out from the background
      p.noStroke();
      p.fill(0, 0, 0, 0.01);
      p.circle(x, y, brushSize * 2);
      p.circle(x, y, brushSize * 1);

      // Draw some emoji
      p.fill(1);

      for (var i = 0; i < count; i++) {
        // Offset a polar
        let r = brushSize * Math.random();
        let theta = Math.random() * Math.PI * 2;
        p.textSize(brushSize);
        let emoji = p.random(hearts);

        let x2 = x + r * Math.cos(theta);
        let y2 = y + r * Math.sin(theta);
        p.text(emoji, x2, y2);
      }
    },
  },

  //======================================================
  {
    label: "🧵",
    isActive: true,
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
    isActive: true,
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
