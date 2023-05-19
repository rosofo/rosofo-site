// a litelement component

import { LitElement, html, css, customElement } from "lit-element";

@customElement("gfx-caves")
export class GfxCaves extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div>
        <h1>gfx-caves</h1>
      </div>
    `;
  }
}
