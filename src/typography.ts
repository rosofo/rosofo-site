import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("h-title")
export class Title extends LitElement {
  render() {
    return html`<h1><slot></slot></h1>`;
  }

  static styles = css`
    h1 {
      font-size: 1rem;
    }
  `;
}

@customElement("p-text")
export class PText extends LitElement {
  render() {
    return html`<p><slot></slot></p>`;
  }

  static styles = css`
    p {
      font-size: 2rem;
    }
  `;
}
