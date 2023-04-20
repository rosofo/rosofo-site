import { FragDebugConfig, FragDebugger } from "test-utils/frag";

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref } from "lit/directives/ref";

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
    return html`<canvas ${ref(this.debugger.ref)}></canvas>`;
  }
}
