import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("nav-breadcrumbs")
export class NavBreadcrumbs extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", () => {
      this.requestUpdate();
    });
  }

  getCrumbsFromLocation() {
    if (location.pathname === "/") {
      return [];
    }
    const names = location.pathname.slice(1).split("/");
    return names.map((name, index) => ({
      name,
      href: `/${names.slice(0, index + 1).join("/")}`,
    }));
  }
  render() {
    return html`
      <nav>
        <ul>
          ${this.getCrumbsFromLocation().map(
            (crumb) => html`<li><a href="${crumb.href}">${crumb.name}</a></li>`
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

    li:not(:last-child)::after,
    li:first-child::before {
      display: inline-block;
      margin: 0 0.25rem;
      font-family: "Averia Serif Libre", sans-serif;
      content: var(--breadcrumb-sep, ">");
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
      ><button class="mobile"><slot name="mobile-icon"></slot></button>`;
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
