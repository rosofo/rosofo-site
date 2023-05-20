import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import frag from "./caves.glsl?raw";
import "../../components/shader-plane";
const WIDTH = 200;
const HEIGHT = 200;

@customElement("gfx-caves")
export class GfxCaves extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  t = 0;

  render() {
    return html`
      <shader-plane
        textureWidth=${WIDTH}
        textureHeight=${HEIGHT}
        frag=${frag}
        .uniforms=${{
          u_a: { value: [255, 0, 0, 255] },
          u_b: { value: [0, 0, 0, 255] },
        }}
        .beforeFrame=${(ctx) => {}}
      ></shader-plane>
      <input
        type="slider"
        onInput=${(event) => moveA(event.currentTarget.value)}
      />
    `;
  }
}
