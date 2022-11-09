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
};
