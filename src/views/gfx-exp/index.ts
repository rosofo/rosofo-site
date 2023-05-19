import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { router } from "../../router";
import { Route } from "@vaadin/router";
import { views } from "./routes";

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
                ${views.map(
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
