import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "../../components/shader-plane";
import * as THREE from "three";
import { createRef, ref } from "lit/directives/ref.js";
const WIDTH = 400;
const HEIGHT = 400;

@customElement("phys-w")
export class PhysW extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  ref = createRef();

  render() {
    return html`
      <canvas width=${WIDTH} height=${HEIGHT} ${ref(this.ref)}></canvas>
    `;
  }
}
