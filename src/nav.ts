import { css, html, LitElement } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";
import { router } from "./router";
import views from "./views";
import { createStore } from "zustand/vanilla";
import { consumeStore } from "./zustand";
import { Route } from "@vaadin/router";

type NavState = {
  mobileMenuOpen: boolean;
  toggle: () => void;
  close: () => void;
};
const navStore = createStore<NavState>((set) => ({
  mobileMenuOpen: false,
  toggle: () =>
    set(({ mobileMenuOpen }) => ({ mobileMenuOpen: !mobileMenuOpen })),
  close() {
    set(() => ({ mobileMenuOpen: false }));
  },
}));

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
  @consumeStore(navStore)
  navState?: NavState;

  render() {
    return html`<a class="desktop" href="/"><slot name="desktop-icon"></slot></a
      ><button
        class="mobile ${classMap({
          active: Boolean(this.navState?.mobileMenuOpen),
        })}"
        @click=${() => this.navState?.toggle()}
      >
        <slot name="mobile-icon"></slot>
      </button>`;
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
      transition: all 0.2s;
    }

    .active {
      transform: scale(90%);
      filter: hue-rotate(90deg);
    }
  `;
}

@customElement("nav-menu")
export class NavMenu extends LitElement {
  @consumeStore(navStore)
  navState?: NavState;

  handleLocationChange = () => {
    this.navState?.close();
  };
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "vaadin-router-location-changed",
      this.handleLocationChange
    );
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(
      "vaadin-router-location-changed",
      this.handleLocationChange
    );
  }

  render() {
    return html`
      <nav class=${classMap({ hide: !this.navState?.mobileMenuOpen })}>
        <link-list .routes=${views}></link-list>
      </nav>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    nav {
      background-color: var(--orchid-pink);
      container-type: size;
      width: 100%;
      height: 100%;
      padding: 1rem;
      box-sizing: border-box;
    }
    @media only screen and (max-width: 768px) {
      :host {
        position: absolute;
        z-index: 1;
        pointer-events: none;
      }
      nav {
        transition: opacity 0.1s, height 0.05s, width 0.05s;
      }

      nav {
        pointer-events: initial;
        opacity: 1;
      }
      .hide {
        opacity: 0;
        pointer-events: none;
        width: 0%;
        height: 0%;
      }
    }
  `;
}

@customElement("link-list")
export class LinkList extends LitElement {
  @property({ type: Array })
  routes?: Route[];

  render() {
    if (this.routes && this.routes.length > 0)
      return html`
        <ul>
          ${this.routes.map((route) => {
            const name = route.name ?? route.path;
            const href = router.urlForName(route.name);
            return html`<li style=${styleMap({ fontSize: "7cqi" })}>
              <a href=${href}>${name}</a>
              <link-list .routes=${route.children}></link-list>
            </li>`;
          })}
        </ul>
      `;
    else return null;
  }

  static styles = css`
    li {
      list-style: none;
      margin-left: 1rem;
    }
    li::before {
      margin: 0;
    }

    a {
      text-decoration: none;
    }
    ul {
      padding: 0;
      margin: 0;
    }
  `;
}
