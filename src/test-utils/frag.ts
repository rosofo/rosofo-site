import * as THREE from "three";
import { parser, generate } from "@shaderfrog/glsl-parser";
import { FunctionNode, visit } from "@shaderfrog/glsl-parser/ast";
import { chromium } from "@playwright/test";

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
