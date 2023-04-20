import * as THREE from "three";
import {
  LitElement,
  html,
  css,
  PropertyValueMap,
  ReactiveController,
  ReactiveControllerHost,
} from "lit";
import { customElement, property } from "lit/decorators.js";

import { createRef, ref } from "lit/directives/ref.js";
import pkg from "@shaderfrog/glsl-parser/index.js";
const { parser, generate } = pkg;
import { FunctionNode, visit } from "@shaderfrog/glsl-parser/ast/index.js";

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

  return target.texture.source.data as Uint8Array;
}

export type FragDebugConfig = {
  frag: string;
  initData: Uint8Array;
  dataWidth: number;
  dataHeight: number;
};
export class FragDebugger implements ReactiveController {
  ref = createRef<HTMLCanvasElement>();
  config?: FragDebugConfig;
  resultData?: Uint8Array;
  private host;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostUpdated(): void {
    if (this.ref.value && this.config)
      this.resultData = runFrag(
        this.ref.value,
        this.config.frag,
        this.config.initData,
        this.config.dataWidth,
        this.config.dataHeight
      );
  }
}
