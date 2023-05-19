import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { router } from "../../router";
import { Route } from "@vaadin/router";
export const views: Route[] = [
  {
    path: "robex-luv",
    component: "robex-luv",
    name: "robex-luv",
    action: async () => {
      await import("./robex-luv");
    },
  },
  {
    path: "coord-sines",
    component: "coord-sines",
    name: "coord-sines",
    action: async () => {
      await import("./coord-sines");
    },
  },
];

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
