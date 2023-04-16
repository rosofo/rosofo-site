import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { router } from "../../router";

@customElement("gfx-exp")
export class GfxExp extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <div>
        <slot></slot>
        <gfx-nav></gfx-nav>
      </div>
    `;
  }
}

@customElement("gfx-nav")
export class GfxNav extends LitElement {
  render() {
    return html`
        <nav>
            <ul>
                ${router.location.route?.children?.map(
                  (route) =>
                    html`<li><a href=${router.urlForName(route.name ?? "")}>${
                      route.name
                    }</li>`
                )}
            <ul>
        </nav>
        `;
  }
}
