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

  render() {
    return html`
      <shader-plane
        textureWidth=${WIDTH}
        textureHeight=${HEIGHT}
        frag=${frag}
        .uniforms=${{ u_time: { value: 0 } }}
        .beforeFrame=${(ctx) => {
          ctx.uniforms.u_time = { value: ctx.uniforms.u_time.value + 0.01 };
        }}
      ></shader-plane>
    `;
  }
}
