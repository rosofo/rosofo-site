import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import frag from "./caves.glsl?raw";
import "../../components/shader-plane";
import THREE from "three";
const WIDTH = 400;
const HEIGHT = 400;

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
