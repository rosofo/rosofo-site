import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import frag from "./caves.glsl?raw";
import "../../components/shader-plane";
const WIDTH = 400;
const HEIGHT = 400;

@customElement("gfx-caves")
export class GfxCaves extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

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
        }}
        .beforeFrame=${(ctx) => {
          ctx.uniforms.u_x.value = this.x;
          ctx.uniforms.u_time.value = this.x;
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
