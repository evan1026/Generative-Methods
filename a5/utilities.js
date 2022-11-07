Vue.component("slider-controls", {
  template: `
  
  <div class="slider-controls">
    
            <slider 
              :disabled = "disabled"
              v-for="(val, index) in v" 
              :label="labels?.[index]"
              :objKey="index" :obj="v" 
              
            />
         
         </div>`,
  props: {
    labels: {
      default: [],
    },
    disabled: {},
    v: {
      isRequired: true,
      type: Array,
    },
  },
});

Vue.component("slider", {
  template: `<tr class="slider">
      <td><label>{{label}}</label></td>
       <td> <input 
            v-model.number="obj[objKey]"
            ref="slider"
            type="range" min="0" max="1" step=".02"
            :disabled="disabled"
            />
            </td>
            <td>
          <label>{{obj[objKey].toFixed(2)}}</label>
          </td>
      </tr>`,

  props: {
    disabled:{},
    label: {},
    objKey: {
      isRequired: true,
    },
    obj: {
      isRequired: true,
    },
  },
});

function drawEye(
  p,
  { x, y, eyeSize, outerColor = [0, 0, 0], innerColor = [0, 0, 100], blink }
) {
  p.push();
  p.translate(x, y);
  p.scale(1, blink);
  p.fill(...outerColor);
  p.noStroke();
  p.ellipse(0, 0, eyeSize, eyeSize);

  // p.fill(100)
  p.noStroke();
  p.fill(...innerColor);
  p.ellipse(0, -eyeSize * 0.4, eyeSize * 0.6, eyeSize * 0.6);

  p.pop();
}
