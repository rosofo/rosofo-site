import createContext from "gl";
import * as THREE from "three";

function testFrag(frag: string, dataWidth: number, dataHeight: number) {
  const context = createContext(100, 100);
  const renderer = new THREE.WebGLRenderer({ context });
  const texture = new THREE.DataTexture(
    new Uint8Array(dataWidth * dataHeight),
    dataWidth,
    dataHeight
  );
  const material = new THREE.ShaderMaterial({
    fragmentShader: frag,
    uniforms: { u_texture: { value: texture } },
  });
}
