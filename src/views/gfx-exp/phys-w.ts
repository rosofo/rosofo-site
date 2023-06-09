import { LitElement, html, css, PropertyValueMap } from "lit";
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

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    start(this.ref.value!);
  }

  render() {
    return html`
      <canvas width=${WIDTH} height=${HEIGHT} ${ref(this.ref)}></canvas>
    `;
  }
}

const start = (elem: Element) => {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera();
  const renderer = new THREE.WebGLRenderer({ canvas: elem });
  renderer.setSize(WIDTH, HEIGHT);

  const sim = new Sim(renderer, scene, camera);
  sim.start();
};

class Sim {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  t = 0;
  step = 0.01;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  start() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
