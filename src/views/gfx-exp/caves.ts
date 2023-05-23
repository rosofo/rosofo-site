import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "../../components/shader-plane";
import * as THREE from "three";
import * as common from "../../glsl/common";
import glsl from "glslify";
const WIDTH = 400;
const HEIGHT = 400;

const frag = glsl`
precision highp float;

#define PI 3.1415926535897932384626433832795

uniform sampler2D u_texture;

${common.defs}

void main() {
    ivec2 size = textureSize(u_texture, 0);
    
    vec4 bw = mod(floor(gl_FragCoord.x), 2.0) == 0.0 ? vec4(sin(gl_FragCoord.x)) : vec4(0.0);

    ${common.render({
      colors: ["bw"],
      debugColors: ["debugColor(0, vec4(0.0))"],
      vars: ["vec4(0.0)"],
    })}
}
`;

@customElement("gfx-caves")
export class GfxCaves extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  pointer = new THREE.Vector2();

  onPointerMove(event: MouseEvent) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("pointermove", this.onPointerMove.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("pointermove", this.onPointerMove.bind(this));
  }

  x = 0;
  time = 0;

  render() {
    return html`
      <shader-plane
        textureWidth=${WIDTH}
        textureHeight=${HEIGHT}
        frag=${frag}
        .uniforms=${{
          u_x: { value: this.x },
          u_time: { value: this.x },
          u_p1: { value: [WIDTH / 2, HEIGHT / 2] },
          u_mouse: { value: this.pointer },
        }}
        .beforeFrame=${(ctx) => {
          ctx.uniforms.u_x.value = this.x;
          ctx.uniforms.u_time.value = this.x;
          ctx.uniforms.u_mouse.valoue = this.pointer;
        }}
      ></shader-plane>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        @input=${(event: InputEvent) => {
          this.moveX(event.currentTarget?.value);
        }}
      />
    `;
  }

  moveX(value: number | null) {
    this.x = value ?? 0;
  }
}
