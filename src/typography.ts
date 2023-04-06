import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("h-title")
export class Title extends LitElement {
  @property({ type: Number })
  l = 1;
  render() {
    switch (this.l) {
      case 3:
        return html`<h3><slot></slot></h3>`;
      case 2:
        return html`<h2><slot></slot></h2>`;
      case 1:
      default:
        return html`<h1><slot></slot></h1>`;
    }
  }

  static styles = css`
    h1 {
      font-size: 5cqi;
      font-family: "Averia Serif Libre", serif;
    }
    h2 {
      font-size: 4.2cqi;
      font-family: "Sarina", cursive;
    }
    h3 {
      font-size: 4.1cqi;
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
      font-size: 2.8cqi;
    }
  `;
}
