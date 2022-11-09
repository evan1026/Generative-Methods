const GENERATORS = {

  triangles: {
    description: "Triangles",

    sliders: [
      "hue",
      "lightness",
      "width",
      "height",
      "rotation",
      "border"
    ],

    landmarks: {
      "Fir Tree": [0.38, 0.20, 0.16, 0.86, 0.0, 0.2],
      "Dorito": [0.12, 0.5, 0.74, 0.67, 0.26, 0.4],
      "Right Arrow": [0, 1, 0.45, 0.6, 0.25, 0.7],
      "Left Arrow": [0, 1, 0.45, 0.6, 0.75, 0.7],
      "Piece of Confetti": [0, 0.5, 0, 0, 0.4, 0.02],
    },

    draw(p, t, dna, index) {
      p.push();

      let hue = dna[0] * 360;
      let lightness = dna[1] * 100;
      let width = dna[2] * 100 + 20;
      let height = dna[3] * 100 + 20;
      let rotation = dna[4] * 2 * Math.PI;
      let borderWidth = dna[5] * 5;

      p.translate(0, -20);

      p.translate(0, -height / 2);
      p.rotate(rotation);
      p.translate(0, height / 2);

      p.strokeWeight(borderWidth);
      p.stroke(0);
      p.fill(hue, 100, lightness);
      p.triangle(-width / 2, 0, 0, -height, width / 2, 0);

      p.pop();
    },
  },

  cats: {
    description: "meow",

    sliders: [
      "Fur Saturation",
      "Fur Lightness",
      "Eye Color",
      "Pupil",
      "Whisker Color",
    ],

    setup(p, index) {
      if (!this.blinkTimes) {
        this.blinkTimes = [];
      }

      this.blinkTimes.push(Math.random() * 50 + 10);
    },

    landmarks: {
      "Nutmeg": [0.40,0.66,0.22,0.54,1.00],
      "Autumn": [0.38,0.12,0.32,0.32,0.40],
      "Winter": [0.00,0.70,0.16,0.42,1.00],
      "Pepper": [0.00,0.08,0.12,0.42,0.34],
      "Sammy":  [0.72,0.64,0.28,0.18,1.00]
    },

    draw(p, t, dna, index) {
      p.push();

      let furSaturation = dna[0] * 100;
      let furLightness = dna[1] * 100;
      let eyeColor = dna[2] * 180 + 30;
      let pupilWidth = dna[3] * 8.5 + 0.5;
      let whiskerColor = dna[4] * 100;

      // Ears
      p.fill(20, furSaturation, furLightness);
      p.strokeWeight(0.5);
      p.stroke(0);
      p.triangle(-45, -115, -25, -175, 0, -125);
      p.triangle(45, -115, 25, -175, 0, -125);

      // Inner ears
      p.noStroke();
      p.fill(20, furSaturation, furLightness * 0.9);
      p.triangle(-35, -125, -24, -165, -10, -135);
      p.triangle(35, -125, 24, -165, 10, -135);

      // Head
      p.fill(20, furSaturation, furLightness);
      p.strokeWeight(0.5);
      p.stroke(0);
      p.circle(0, -100, 50);

      if (t < this.blinkTimes[index]) {
        // Eyes
        p.strokeWeight(0.25);
        p.fill(eyeColor, 50, 50);
        p.ellipse(-20, -115, 10, 8);
        p.ellipse(20, -115, 10, 8);

        // Pupils
        p.fill(0);
        p.ellipse(-20, -115, pupilWidth, 7);
        p.ellipse(20, -115, pupilWidth, 7);
      } else {
        p.strokeWeight(1.5);
        p.stroke(0);
        p.line(-25, -115, -15, -115);
        p.line(25, -115, 15, -115);
        this.blinkTimes[index] = t + Math.random() * 50 + 10;
      }

      // Whiskers
      p.strokeWeight(1);
      p.stroke(whiskerColor);
      p.line(-30, -82, -90, -78);
      p.line(-32, -84, -92, -82);
      p.line(-31, -86, -92, -85);
      p.line(-29, -80, -89, -74);

      p.line(30, -82, 90, -78);
      p.line(32, -84, 92, -82);
      p.line(31, -86, 92, -85);
      p.line(29, -80, 89, -74);

      // Nose
      p.strokeWeight(0.5);
      p.stroke(0);
      p.fill(0, 35, 50);
      p.triangle(0, -91, -5, -100, 5, -100);

      // Mouth
      p.strokeWeight(1.5);
      p.stroke(0);
      p.line(0, -91, 0, -80);
      p.line(-10, -75, 0, -80);
      p.line(10, -75, 0, -80);


      p.pop();
    },
  },
};
