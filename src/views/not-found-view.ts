import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("not-found-view")
export class NotFoundView extends LitElement {
  render() {
    return html`<h1>Not Found</h1>`;
  }
}
