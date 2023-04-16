import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { router } from "../../router";
import { Route } from "@vaadin/router";

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
  @state()
  routes: Route[] = [];
  setRoutes() {
    this.routes = router.location.route?.children ?? [];
  }
  connectedCallback(): void {
    window.addEventListener("vaadin-router-location-changed", this.setRoutes);
  }
  disconnectedCallback(): void {
    window.removeEventListener(
      "vaadin-router-location-changed",
      this.setRoutes
    );
  }
  render() {
    return html`
        <nav>
            <ul>
                ${this.routes.map(
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
