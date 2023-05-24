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
uniform float u_t;

${common.defs}

vec4[8] neighbours(vec2 coord) {
    return vec4[8](
        texelFetch(u_texture, ivec2(coord + vec2(-1.0, -1.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(0.0, -1.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(1.0, -1.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(-1.0, 0.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(1.0, 0.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(-1.0, 1.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(0.0, 1.0)), 0),
        texelFetch(u_texture, ivec2(coord + vec2(1.0, 1.0)), 0)
    );
}

vec4 avg(vec4[8] neighbours) {
    vec4 sum = vec4(0.0);
    for (int i = 0; i < 8; i++) {
        sum += neighbours[i];
    }
    return sum / 8.0;
}

void main() {
    ivec2 size = textureSize(u_texture, 0);
    
    vec4 midline = ${common.texelCoord(
      "gl_FragCoord"
    )}.y == size.y / 2 ? vec4(1.0) : vec4(0.0);
    
    vec4 a = vec4(${common.getScreenTexel("gl_FragCoord")}.xyz, 1.0);
    vec4[8] neighbours = neighbours(gl_FragCoord.xy);
    for (int i = 0; i < 8; i++) {
      if (length(neighbours[i].xyz) > 1.0) {
        a += vec4(0.0, 0.0, 0.001, 0.0);
      } else if (length(neighbours[i].z) > 0.5) {
        a += vec4(0.0, 0.0, 0.001, 0.0);
      }
    }

    ${common.render({
      colors: ["midline", "a"],
      debugColors: ["vec4(0.0)"],
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

  t = 0;
  step = 0.01;

  render() {
    return html`
      <shader-plane
        textureWidth=${WIDTH}
        textureHeight=${HEIGHT}
        frag=${frag}
        .uniforms=${{
          u_t: { value: this.t },
        }}
        .beforeFrame=${(ctx) => {
          ctx.uniforms.u_t.value = this.t += this.step;
        }}
      ></shader-plane>
      <input type="range" min="0" max="1" step="0.01" />
    `;
  }
}
