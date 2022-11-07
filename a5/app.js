/**
 * Starter code
 * Create N swatches
 * Each swatch has code for when it starts and each frame after
 */

/* globals Vue, p5,randomVector, GENERATORS, createPopulation */

// TODO: ADD YOUR SYSTEM HERE

let p;
let sound = {
  fft: new p5.FFT(),
  song: undefined,
  spectrum: [],
};

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;

window.addEventListener("load", function () {
  console.log("LOADED");
  let system;

  let population = [];
  for (var i = 0; i < 10; i++) {
    population[i] = randomVector(2 + Math.floor(Math.random() * 2));
  }

  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------
  // VUE!!!
  // Create a new vue interface

  new Vue({
    template: `<div id="controls">
        <div>
          <div>
            <select v-model="generatorName">
              <option v-for="(data,name) in generators">{{name}}</option>
            </select>
          </div>
          <div>{{generator.description}}</div>
          
          <div>
            <label>mutation</label>
            <input type="range" v-model.number ="mutation" min="0" max="1" step=".02" size="6" />

            <label>{{mutation.toFixed(2)}}</label>
          </div>
          
          <input type="number" v-model="populationCount" width="3"  min="1" />
          
        
         <button @click="playSong">🎵</button>
          
          <span>
            Seed:<input v-model="seed" />
            <button @click="randomize">🎲</button>
            
          </span>
          
           <button @click="toggleRandomWalk" :class="{active:randomWalk}">〰</button>
           
          
           <input :value="selected.map(s => s.toFixed(2))" /> 
            <span v-if="generator.landmarks">
          
            <button v-for="landmark, name  in generator.landmarks" @click="loadLandmark(landmark)">{{name}}</button>
          </span>
          </div>
          <slider-controls :v="selected" :labels="generator.sliders" :disabled="randomWalk" /> 
          
          
        </div>
      
      </div>`,

    watch: {
      populationCount() {
        console.log("count change", this.populationCount);
        this.positions = getPositions(this.populationCount);
        changeToCount(this.generator, this.population, this.populationCount);
        localStorage.setItem("populationCount", this.populationCount);
      },

      generator() {
        console.log("generator change");

        this.repopulate();
      },
    },
    methods: {
      playSong() {
        this.dancer = playSong();
      },
      loadLandmark(landmark) {
        setToVector(this.selected, landmark);
      },
      toggleRandomWalk() {
        this.randomWalk = !this.randomWalk;
      },
      randomize() {
        this.seed = Math.floor(Math.random() * 1000000);
        this.repopulate();
      },
      repopulate(parent) {
        if (parent) {
          Math.seedrandom(Date.now());
        } else {
          // Create based on the set seed
          Math.seedrandom(this.seed);
        }
        this.population = createPopulation(
          this.generator,
          this.populationCount,
          parent,
          this.mutation
        );

        // NEW: do setup for each individual
        if (this.generator.setup) {
          this.population.forEach((individual) =>
            this.generator.setup(p, individual)
          );
        }

        this.positions = getPositions(this.populationCount);
      },
    },

    mounted() {
      localStorage.setItem("seed", this.seed);

      function onscreen() {
        return (
          p.mouseX > 0 &&
          p.mouseX < p.width &&
          p.mouseY > 0 &&
          p.mouseY < p.height
        );
      }

      // Create a P5 canvas element, JS-style
      // https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
      const s = (p0) => {
        p = p0;

        (p.preload = () => {
          sound.song = p.loadSound(
            "https://cdn.glitch.global/18feb58c-b4a9-4621-8002-9554790280e4/351717__monkeyman535__cool-chill-beat-loop.mp3?v=1666150235274"
          );
          console.log("song loadded");
        }),
          (p.setup = () => {
            p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            p.colorMode(p.HSL, 360, 100, 100);
            p.ellipseMode(p.RADIUS);
          });

        p.draw = () => {
          let t = p.millis() * 0.001;
          // setVectorToWander(v, t)

          // Update the sound
          if (sound.song.isPlaying()) {
            sound.spectrum = sound.fft.analyze();
          }

          // Draw a background
          if (this.generator.drawBackground)
            this.generator.drawBackground(p, t);
          else p.background(180, 80, 80);

          p.push();

          // DRAW MUSIC
          if (sound.spectrum && sound.song.isPlaying()) {
            // console.log(sound.spectrum);
            // p.circle(0, .height, 100)

            // Visualize the spectrum
            for (var i = 0; i < sound.spectrum.length; i++) {
              let x = i * 5;
              let y = (sound.spectrum[i] / 180) ** 5; // make it...spikier?
              // console.log(y)
              p.fill(0);
              p.rect(x, p.height, 4, -y * 20);
            }

            this.population.forEach((v, index) =>
              setToSpectrum(sound.spectrum, v, index)
            );
          } else if (this.randomWalk) {
            p.noiseDetail(2, 0.2);
            this.population.forEach((v, index) => setToNoise(p, v, t, index));
          }

          // DRAW THE POPULATION
          this.population.forEach((individual, index) => {
            // figure out the placement for these
            p.push();
            p.translate(...this.positions[index]);
            if (index === this.selectedIndex) {
              p.fill(0, 0, 0, 0.2);
            } else {
              p.fill(0, 0, 0, 0.06);
            }
            p.noStroke();
            p.ellipse(0, 0, 40, 20);
            p.ellipse(0, 0, 30, 15);

            p.fill(0);
            p.text(index, 0, 10);

            this.generator.draw(p, t, individual, index);
            p.pop();
          });
          p.pop();
        };

        p.doubleClicked = () => {
          if (onscreen()) this.repopulate(this.selected, p);
        };

        p.mouseClicked = () => {
          if (onscreen()) {
            let closestDist = 100;
            let closestIndex = 0;
            //           Get the closest position
            for (var i = 0; i < this.positions.length; i++) {
              let d = Math.abs(p.mouseX - this.positions[i][0]);
              // console.log(d)
              if (d < closestDist) {
                closestDist = d;
                closestIndex = i;
              }
            }
            this.selectedIndex = closestIndex;
            console.log("Clicked", this.selectedIndex);
          }
        };
      };

      // Create P5
      const CANVAS_EL = document.getElementById("canvas-holder");
      CANVAS_EL.style.width = CANVAS_WIDTH + "px";
      CANVAS_EL.style.height = CANVAS_HEIGHT + "px";
      new p5(s, CANVAS_EL);

      // Populate after creating p5
      this.repopulate();
    },

    computed: {
      generator() {
        return this.generators[this.generatorName];
      },
      selected() {
        return this.population[this.selectedIndex];
      },
    },

    data() {
      return {
        sound: sound,
        randomWalk: false,
        mutation: 0.1,
        positions: [],
        populationCount: localStorage.getItem("populationCount") || 5,
        seed:
          localStorage.getItem("seed") || Math.floor(Math.random() * 1000000),
        generatorName: Object.keys(GENERATORS)[0],
        generators: GENERATORS,
        selectedIndex: localStorage.getItem("generatorIndex") || 0,
        population: population,
      };
    },
    el: "#controls",
  });

  function playSong() {
    console.log(sound.song);
    if (sound.song.isPlaying()) sound.song.pause();
    else sound.song.play();

    //   var dancer = new Dancer();

    //   var a = new Audio();
    //   a.crossOrigin = "anonymous";

    //   a.src = 'https://cdn.glitch.global/18feb58c-b4a9-4621-8002-9554790280e4/351717__monkeyman535__cool-chill-beat-loop.mp3?v=1666150235274';
    //   dancer.load( a );
    // return dancer
  }
});

function getPositions(count) {
  let positions = [];
  for (var i = 0; i < count; i++) {
    let pct = count == 1 ? 0.5 : i / (count - 1);
    let x = CANVAS_WIDTH * 0.5 + (CANVAS_WIDTH - 100) * 0.9 * (pct - 0.5);
    let y = CANVAS_HEIGHT * (0.8 + 0.1 * (i % 2)) + 10 * Math.sin(i);
    positions.push([x, y]);
  }
  positions.sort((a, b) => a[1] - b[1]);
  return positions;
}
