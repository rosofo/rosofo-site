// a litelement component
import * as THREE from "three";

import { LitElement, html, css, customElement } from "lit-element";
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
      <div>
        <shader-plane
          textureWidth=${WIDTH}
          textureHeight=${HEIGHT}
          frag=${frag}
          .uniforms=${{ u_time: { value: 0 } }}
          .beforeFrame=${(ctx) => {
            ctx.uniforms.u_time = { value: this.clock.next() };
          }}
        ></shader-plane>
      </div>
    `;
  }
}
