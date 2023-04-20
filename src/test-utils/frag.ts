import * as THREE from "three";
import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";

import { createRef, ref } from "lit/directives/ref.js";
import { parser, generate } from "@shaderfrog/glsl-parser";
import { FunctionNode, visit } from "@shaderfrog/glsl-parser/ast";

export function extractGlslFunction(frag: string, name: string) {
  let func: FunctionNode | undefined;
  const ast = parser.parse(frag);
  visit(ast, {
    function: {
      enter: (p) => {
        if (p.node.prototype.header.name.identifier === name) {
          func = p.node;
        }
      },
    },
  });
  return generate(func);
}

export function runFrag(
  canvas: HTMLCanvasElement,
  frag: string,
  data: Uint8Array,
  dataWidth: number,
  dataHeight: number
) {
  const renderer = new THREE.WebGLRenderer({ canvas });
  const texture = new THREE.DataTexture(data, dataWidth, dataHeight);
  const target = new THREE.WebGLRenderTarget(dataWidth, dataHeight);
  const material = new THREE.ShaderMaterial({
    fragmentShader: frag,
    uniforms: { u_texture: { value: texture } },
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(80, 1);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(), material);
  scene.add(plane);
  camera.position.z = 0.6;

  renderer.setRenderTarget(target);
  renderer.render(scene, camera);

  return target.texture.source;
}

@customElement("frag-debugger")
export class FragDebugger extends LitElement {
  ref = createRef<HTMLCanvasElement>();
  frag?: string;
  data?: Uint8Array;
  dataWidth = 100;
  dataHeight = 100;
  resultData?: THREE.Source;

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (this.ref.value && this.frag && this.data)
      this.resultData = runFrag(
        this.ref.value,
        this.frag,
        this.data,
        this.dataWidth,
        this.dataHeight
      );
  }

  render() {
    return html`<canvas ${ref(this.ref)}></canvas>
      <p>${this.resultData?.data}</p>`;
  }
}
