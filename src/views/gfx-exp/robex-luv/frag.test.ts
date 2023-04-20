import { FragDebugConfig, FragDebugger } from "test-utils/frag";

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import { test, expect } from "@sand4rt/experimental-ct-web";
import frag from "./frag.glsl?raw";

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
      <p>${this.config.initData}</p>
      <p>${this.debugger.resultData}</p>
    `;
  }
}

test("it sets pixel 0,0 only", async ({ mount }) => {
  const component = await mount(FragTest, {
    props: {
      config: {
        initData: new Uint8Array(16),
        dataWidth: 2,
        dataHeight: 2,
        frag,
      },
    } as any,
  });
  await expect(component).toContainText("foo");
});
