// a litelement component
import * as THREE from "three";

import { LitElement, html, css, customElement } from "lit-element";

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
        <h1>gfx-caves</h1>
      </div>
    `;
  }
}

// Creates a new three.js context, scene and camera
// @param canvas The canvas element to render to
const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  return { scene, camera, renderer };
};
