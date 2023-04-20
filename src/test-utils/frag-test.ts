import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ref } from "lit/directives/ref.js";
import { FragDebugConfig, FragDebugger } from "./frag";

@customElement("frag-test")
export class FragTest extends LitElement {
  @property({ type: Object })
  config!: FragDebugConfig;

  debugger = new FragDebugger(this, this.config);
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <canvas ${ref(this.debugger.ref)}></canvas>
      <p>${Array.from(this.config.initData)}</p>
      <p>${this.debugger.resultData && Array.from(this.debugger.resultData)}</p>
    `;
  }
}
