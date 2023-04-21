import { LitElement, html, PropertyValueMap } from "lit";
import { customElement, state } from "lit/decorators.js";
import frag from "./frag.glsl?raw";
import "../../../components/shader-plane";

const WIDTH = 100;
const HEIGHT = 100;

@customElement("robex-luv")
export class RobexLuv extends LitElement {
  render() {
    return html`<shader-plane
        textureWidth=${WIDTH}
        textureHeight=${HEIGHT}
        frag=${frag}
        .uniforms=${{ u_width: { value: WIDTH }, u_height: { value: HEIGHT } }}
      ></shader-plane>
      <frag-debugger></frag-debugger>`;
  }
}
