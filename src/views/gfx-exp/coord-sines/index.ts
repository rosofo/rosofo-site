import { LitElement, html, PropertyValueMap } from "lit";
import { customElement, state } from "lit/decorators.js";
import * as THREE from "three";
import frag from "./frag.glsl?raw";
import "../../../components/shader-plane";

const WIDTH = 200;
const HEIGHT = 200;

@customElement("coord-sines")
export class CoordSines extends LitElement {
  clock = new ModClock(0.01);
  render() {
    return html`<shader-plane
      textureWidth=${WIDTH}
      textureHeight=${HEIGHT}
      frag=${frag}
      .uniforms=${{ u_time: { value: 0 } }}
      .beforeFrame=${(ctx) => {
        ctx.uniforms.u_time = { value: this.clock.next() };
      }}
    ></shader-plane>`;
  }
}

class ModClock {
  timer = new THREE.Clock();
  step = 0.01;
  t = 0;
  max;
  constructor(step: number, max?: number) {
    this.step = step;
    this.max = max ?? 1;
  }
  next() {
    this.t = (this.t + this.timer.getDelta() * this.step) % this.max;
    return this.t;
  }
}
