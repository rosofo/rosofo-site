import { hierarchy, tree } from "d3-hierarchy";
import { LitElement, html, svg, SVGTemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HashTree } from "./hash-tree";

@customElement("hash-trees-view")
export class HashTreesView extends LitElement {
  handleBuild(event: Event) {
    event.preventDefault();
  }
  tree?: HashTree = {
    hash: "1",
    data: "1",
    metadata: undefined,
    children: [{ hash: "2", data: "2", metadata: undefined }],
  };
  render() {
    return html`
      <heading>
        <h-title l="1">Hash Trees</h-title>
      </heading>
      <section>
        <form>
          <label for="contents">Text content to build a tree from</label>
          <textarea name="contents"></textarea>
          <input type="submit" value="Build" @click=${this.handleBuild} />
        </form>
      </section>
      <section>
        <heading>
          <h-title l="3">Visualisation</h-title>
        </heading>
        <tree-vis .tree=${this.tree}></tree-vis>
      </section>
    `;
  }
}

@customElement("tree-vis")
export class TreeVis extends LitElement {
  @property({ type: Object })
  tree?: HashTree;
  render() {
    if (this.tree) {
      const h = hierarchy(this.tree);
      const t = tree<typeof this.tree>();
      const layout = t(h);
      const nodes: SVGTemplateResult[] = [];
      layout.each((node) =>
        nodes.push(
          svg`
          <g transform="translate(${node.x}, ${node.y})">
            <circle r="0.3" />
            <g transform="translate(0.6, 0.35)">
              <text>${node.data.hash}</text>
            </g>
          </g>`
        )
      );
      return html` <svg viewBox="-2 -2 25 25">${nodes}</svg> `;
    } else {
      return html``;
    }
  }

  static styles = css`
    text {
      font-size: 0.08rem;
    }
  `;
}
