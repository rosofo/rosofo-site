import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import WavesAnimation from "./WavesAnimation";

@customElement("stress-waves")
export class StressWaves extends LitElement {
  private ref = createRef();
  root?: Root;

  pullApart = false;

  firstUpdated(): void {
    if (this.ref.value) {
      this.root = createRoot(this.ref.value);
      this.root.render(
        React.createElement(WavesAnimation, { pullApart: this.pullApart })
      );
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.root?.unmount();
  }
  render() {
    return html`<svg
      viewBox="-25 -75 200 200"
      transform="matrix(1, 0.2, 0.2, 1, 0, 0)"
      ${ref(this.ref)}
    ></svg>`;
  }
}
