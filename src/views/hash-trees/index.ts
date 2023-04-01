import { hierarchy, tree } from "d3-hierarchy";
import * as d3 from "d3";
import { LitElement, html, svg, SVGTemplateResult, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { buildHashTree, HashTree } from "./hash-tree";

@customElement("hash-trees-view")
export class HashTreesView extends LitElement {
  handleBuild(event: Event) {
    this.text = (event.currentTarget as HTMLTextAreaElement).value;
  }

  @state()
  text = "";
  @state()
  chunkSize = 4;

  handleChunkSize(event: Event) {
    this.chunkSize = Number((event.currentTarget as HTMLInputElement).value);
  }

  render() {
    return html`
      <header>
        <h-title l="1">Hash Trees</h-title>
      </header>
      <section>
        <label for="contents"
          ><p-text>Text content to build a tree from</p-text></label
        >
        <textarea
          style="display: block;"
          name="contents"
          @input=${this.handleBuild}
        ></textarea>
        <label for="chunksize">Chunk Size</label>
        <input
          name="chunksize"
          type="range"
          min="1"
          max="20"
          step="1"
          @input=${this.handleChunkSize}
        />
      </section>
      <section>
        <header>
          <h-title l="3">Visualisation</h-title>
        </header>
        <tree-vis .tree=${buildHashTree(this.text, this.chunkSize)}></tree-vis>
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
      t.size([6, 3]);
      const layout = t(h);
      const nodes: SVGTemplateResult[] = [];
      const link = d3.link(d3.curveBumpY);
      layout.each((node) =>
        nodes.push(
          svg`
          ${node.children?.map(
            (child) =>
              svg`<path fill="none" stroke-width="0.1" stroke="black" d=${link({
                source: [node.x, node.y],
                target: [child.x, child.y],
              })} />`
          )}
          <g transform="translate(${node.x}, ${node.y})">
            <circle r="0.1" />
            <g transform="translate(0.6, 0.35)">
              <text>${node.data.data ?? node.data.hash}</text>
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
      font-size: 0.023rem;
    }
  `;
}
