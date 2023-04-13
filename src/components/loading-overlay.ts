import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { routingState } from "../router";

@customElement("loading-overlay")
export class LoadingIndicator extends LitElement {
  @state()
  state = { isLoading: false, isError: false };

  unsub = () => {};

  connectedCallback(): void {
    super.connectedCallback();
    this.unsub = routingState.subscribe((state) => {
      this.state = state;
    });
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsub();
  }
  render() {
    return html`<div class=${classMap({ active: this.state.isLoading })}>
      <slot></slot>
    </div>`;
  }

  static styles = css`
    @keyframes bg {
      from {
        background-position: 100% 100%;
      }
      to {
        background-position: 0% 0%;
      }
    }
    div.active {
      border-radius: 0.5rem;
      width: 100%;
      height: 40rem;
      animation: 1s infinite bg;
      background: rgb(93, 54, 97);
      background: linear-gradient(
        153deg,
        rgba(93, 54, 97, 0) 0%,
        rgba(179, 22, 126, 1) 50%,
        rgba(68, 125, 136, 0) 100%
      );
      background-size: 800% 800%;
    }
  `;
}
