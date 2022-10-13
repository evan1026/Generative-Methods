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
      this.colorProgression = [[60, 100, 50], [60, 100, 50],[60, 100, 50],[60, 100, 50],[45, 100, 50], [30, 100, 50], [15, 100, 50], [0, 100, 50], [0, 100, 50], [0, 50, 50], [0, 25, 50], [0, 0, 50]];
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
          newPt.strokeWidth = pt.strokeWidth + 0.5;

          pt.spawnedChild = true;

          newPts.push(newPt);
        }
      });

      this.points = this.points.filter(point => point.lifespan > 0);
      this.points = this.points.concat(newPts);
    },
  },
  {
    label: "⚇",
    isActive: true,
    description:
    "Symmetric Line Tool",

    draw() {
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      if (p.mouseIsPressed) {
        p.stroke(...color0);

        p.strokeWeight(brushSize * 10 + 2);
        p.line(x, y, x1, y1);
        p.line(CANVAS_WIDTH - x, y, CANVAS_WIDTH - x1, y1);
        p.line(x, CANVAS_HEIGHT - y, x1, CANVAS_HEIGHT - y1);
        p.line(CANVAS_WIDTH - x, CANVAS_HEIGHT - y, CANVAS_WIDTH - x1, CANVAS_HEIGHT - y1);
      }
    },
  },
  {
    label: "👾",
    description: "Future Invasion - It gets closer the longer you hold the mouse down",
    isActive: true,

    setup() {
      this.size = 5;
    },

    draw() {
      if (p.mouseIsPressed) {
        let hearts = ["👾", "👽", "🤖", "🦾", "🦿", "🛸"];
        let x = p.mouseX;
        let y = p.mouseY;

        this.size += 0.05;
        let count = 1;

        let intSize = Math.floor(this.size);

        // Scale the cluster by how far we have moved since last frame
        // the "magnitude" of the (movedX, movedY) vector
        let distanceTravelled = p.mag(p.movedX, p.movedY);

        // I often draw a shadow behind my brush,
        // it helps it stand out from the background
        p.noStroke();
        p.fill(0, 0, 0, 0.01);
        p.circle(x, y, intSize * 2);
        p.circle(x, y, intSize * 1);

        // Draw some emoji
        p.fill(1);

        for (var i = 0; i < count; i++) {
          // Offset a polar
          let r = intSize * Math.random();
          let theta = Math.random() * Math.PI * 2;
          p.textSize(intSize);
          let emoji = p.random(hearts);

          let x2 = x + r * Math.cos(theta);
          let y2 = y + r * Math.sin(theta);
          p.text(emoji, x2, y2);
        }
      }
    },
  },
  {
    label: "🌱",
    isActive: true,
    description: "Tree Tool - use brush size to determine spread angle",

    setup() {
      this.points = [];
      this.brown = [16, 68, 22];
      this.green = [120, 100, 50];
      this.darkgreen = [120, 100, 25];
      this.maxGenerations = 6;
      this.moveSpeed = 2;
      this.lengthRatio = 3 / 4;
    },

    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;

      let pt = [x, y, 0, -1];
      pt.start = [x, y];

      // How long does this dot live?
      pt.totalLifespan = 10 + Math.random()*10;
      pt.lifespan = pt.totalLifespan;

      pt.generation = 0;

      this.points.push(pt);
    },

    draw() {
      let t = p.millis() * .001;

      let newPts = [];

      // Each point keeps drawing itself, as long as it has a lifespan
      this.points.forEach((pt, index) => {
        pt.lifespan--;

        if (pt.lifespan > 0) {

          let prevX = pt.start[0];
          let prevY = pt.start[1];

          pt[0] += pt[2] * this.moveSpeed;
          pt[1] += pt[3] * this.moveSpeed;

          if (pt.generation > 1) {
            p.stroke(...this.darkgreen);
            p.strokeWeight(2);
            p.line(pt[0], pt[1], prevX, prevY);

            p.stroke(...this.green);
            p.strokeWeight(1);
            p.line(pt[0], pt[1], prevX, prevY);
          } else {
            p.stroke(...this.brown);
            p.strokeWeight(2);
            p.line(pt[0], pt[1], prevX, prevY);
          }

        } else {
          if (pt.generation < this.maxGenerations) {
            rotationRadians = brushSize * 75 * Math.PI / 180;
            let pt1DirectionX = pt[2] * Math.cos(rotationRadians) - pt[3] * Math.sin(rotationRadians);
            let pt1DirectionY = pt[2] * Math.sin(rotationRadians) + pt[3] * Math.cos(rotationRadians);

            let pt2DirectionX = pt[2] * Math.cos(-rotationRadians) - pt[3] * Math.sin(-rotationRadians);
            let pt2DirectionY = pt[2] * Math.sin(-rotationRadians) + pt[3] * Math.cos(-rotationRadians);

            let newPt1 = [pt[0], pt[1], pt1DirectionX, pt1DirectionY];
            let newPt2 = [pt[0], pt[1], pt2DirectionX, pt2DirectionY];

            newPt1.start = [pt[0], pt[1]];
            newPt2.start = [pt[0], pt[1]];

            newPt1.totalLifespan = pt.totalLifespan * this.lengthRatio;
            newPt1.lifespan = newPt1.totalLifespan;
            newPt2.totalLifespan = pt.totalLifespan * this.lengthRatio;
            newPt2.lifespan = newPt2.totalLifespan;

            newPt1.generation = pt.generation + 1;
            newPt2.generation = pt.generation + 1;

            newPts.push(newPt1);
            newPts.push(newPt2);
          }
        }

      });

      this.points = this.points.filter(point => point.lifespan > 0);
      this.points = this.points.concat(newPts);
    },
  },
];
