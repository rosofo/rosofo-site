import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ref } from "lit/directives/ref.js";
import { FragDebugConfig, FragDebugger } from "./frag";

@customElement("frag-test")
export class FragTest extends LitElement {
  @property({ type: Object })
  config?: FragDebugConfig;

  debugger = new FragDebugger(this);
  protected update(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.update(_changedProperties);
    if (this.config) this.debugger.config = this.config;
  }
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
      <p>${this.config && Object.values(this.config.initData)}</p>
      <p>
        ${this.debugger.resultData && Object.values(this.debugger.resultData)}
      </p>
    `;
  }
}
