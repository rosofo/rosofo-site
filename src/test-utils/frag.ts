import createContext from "gl";
import * as THREE from "three";

export function runFrag(
  frag: string,
  data: Uint8Array,
  dataWidth: number,
  dataHeight: number
) {
  const context = createContext(100, 100);
  const renderer = new THREE.WebGLRenderer({ context });
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
