import { LitElement, html, PropertyValueMap } from "lit";
import { customElement, state } from "lit/decorators.js";
import * as THREE from "three";
import frag from "./frag.glsl?raw";
import "../../../components/shader-plane";

const WIDTH = 200;
const HEIGHT = 200;

@customElement("robex-luv")
export class RobexLuv extends LitElement {
  render() {
    return html`<shader-plane
      textureWidth=${WIDTH}
      textureHeight=${HEIGHT}
      frag=${frag}
      .uniforms=${{ u_width: { value: WIDTH }, u_height: { value: HEIGHT } }}
    ></shader-plane>`;
  }
}
