import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { router, views } from "./router";

@customElement("nav-breadcrumbs")
export class NavBreadcrumbs extends LitElement {
  @state()
  crumbs: { name: string; href: string }[] = [];
  getCrumbsFromLocation() {
    if (router.location.pathname === "" || router.location.pathname === "/") {
      return [];
    }
    const names = router.location.pathname.slice(1).split("/");
    return names.map((name, index) => ({
      name,
      href: `/${names.slice(0, index + 1).join("/")}`,
    }));
  }
  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("vaadin-router-location-changed", () => {
      this.crumbs = this.getCrumbsFromLocation();
    });
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("vaadin-router-location-changed", () => {});
  }
  render() {
    return html`
      <nav>
        <ul>
          ${this.crumbs.map(
            (crumb, index) =>
              html`<li
                style=${styleMap({
                  "--delay": (index * 0.1).toString() + "s",
                })}
              >
                <a href="${crumb.href}">${crumb.name}</a>
              </li>`
          )}
        </ul>
      </nav>
    `;
  }

  static styles = css`
    nav {
      padding: 0 0.5rem;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      animation: slide 0.25s ease-in var(--delay), in 0.25s ease-in var(--delay);
      animation-fill-mode: backwards;
    }

    li::before {
      display: inline-block;
      margin: 0 0.25rem;
      font-family: "Averia Serif Libre", sans-serif;
      content: var(--breadcrumb-sep, ">");
    }

    @keyframes slide {
      from {
        transform: translateX(-0.5rem);
      }
      to {
        transform: translateX(0rem);
      }
    }

    @keyframes in {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    a {
      text-decoration: none;
      color: var(--magenta-haze, initial);
      font-size: 1.2rem;
    }
    a:hover {
      text-decoration: underline solid var(--magenta-haze) 0.2rem;
    }
  `;
}

@customElement("menu-button")
export class MenuButton extends LitElement {
  render() {
    return html`<a class="desktop" href="/"><slot name="desktop-icon"></slot></a
      ><a class="mobile" href="#menu"><slot name="mobile-icon"></slot></a>`;
  }

  static styles = css`
    .desktop {
      display: none;
    }

    @media only screen and (min-width: 768px) {
      .desktop {
        display: block;
      }
      .mobile {
        display: none;
      }
    }

    button {
      border: none;
      margin: 0;
      padding: 0;
      background: none;
    }
  `;
}

@customElement("nav-menu")
export class NavMenu extends LitElement {
  render() {
    return html`
      <nav>
        <ul>
          ${views.map((route) => {
            const name = route.name ?? route.path;
            const href = router.urlForPath(route.path);
            return html`<li><a href=${href}>${name}</a></li>`;
          })}
        </ul>
      </nav>
    `;
  }

  static styles = css`
    nav {
      opacity: 0;
      pointer-events: none;
    }

    @media only screen and (min-width: 768px) {
      nav {
        opacity: 1;
        pointer-events: initial;
      }
    }

    :host-context(:target) nav {
      opacity: 1;
      pointer-events: initial;
    }
  `;
}
