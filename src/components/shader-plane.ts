import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import * as THREE from "three";

type FrameContext = {
  uniforms: Record<string, THREE.IUniform>;
};
@customElement("shader-plane")
export class ShaderPlane extends LitElement {
  @property({ type: Function })
  beforeFrame?: (ctx: FrameContext) => void;
  @property({ type: String })
  frag?: string;
  @property({ type: Number })
  textureWidth = 100;
  @property({ type: Number })
  textureHeight = 100;
  @property({ type: Object })
  uniforms: Record<string, THREE.IUniform> = {};

  ref = createRef();
  material?: THREE.ShaderMaterial;

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  firstUpdated(): void {
    this.start(this.ref.value!);
  }

  render() {
    return html`<div ${ref(this.ref)}></div>`;
  }
  start(elem: Element) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 1);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.textureWidth, this.textureHeight);

    elem.appendChild(renderer.domElement);

    const data = new Uint8Array(this.textureWidth * this.textureHeight * 4);
    const texture = new THREE.DataTexture(
      data,
      this.textureWidth,
      this.textureHeight
    );

    this.material = new THREE.ShaderMaterial({
      fragmentShader: this.frag,
      uniforms: { u_texture: { value: texture }, ...this.uniforms },
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(), this.material);
    scene.add(plane);
    camera.position.z = 0.6;

    const targetA = new THREE.WebGLRenderTarget(
      this.textureWidth,
      this.textureHeight
    );
    const targetB = new THREE.WebGLRenderTarget(
      this.textureWidth,
      this.textureHeight
    );

    renderer.setRenderTarget(targetA);
    renderer.render(scene, camera);
    let targetBit = true;

    if (this.beforeFrame)
      this.beforeFrame({ uniforms: this.material!.uniforms });
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      if (this.beforeFrame)
        this.beforeFrame({ uniforms: this.material!.uniforms });
      if (targetBit) {
        renderer.setRenderTarget(targetB);
        this.material!.uniforms.u_texture.value = targetA.texture;
      } else {
        renderer.setRenderTarget(targetA);
        this.material!.uniforms.u_texture.value = targetB.texture;
      }
      this.material!.uniformsNeedUpdate = true;
      renderer.render(scene, camera);
      targetBit = !targetBit;
    };
    animate();
  }
}
