import { BaseType, Selection } from "d3";
import * as d3 from "d3";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import produce from "immer";

@customElement("pure-d3")
export class PureD3 extends LitElement {
  ref = createRef<SVGElement>();

  tree = [
    { id: 1 },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 1 },
    { id: 4, parentId: 3 },
    { id: 5, parentId: 3 },
  ];
  select(svg: SVGElement) {
    if (!this.tree) return;
    const tree = d3.stratify()(this.tree);
    const t = d3.tree();
    t.size([20, 20]);
    const nodes = d3
      .select(svg)
      .selectAll("circle")
      .data(t(tree))
      .join("circle")
      .style("opacity", "0");

    nodes
      .on("mouseover", function () {
        d3.select(this).style("fill", "pink");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", "lightblue");
      })
      .on("click", (e, d) => {
        this.tree = produce((tree) =>
          d.descendants().forEach((remove) => {
            const index = tree.findIndex((node) => node.id === remove.id);
            if (index !== undefined) {
              tree.splice(index, 1);
            }
          })
        )(this.tree);
        this.select(svg);
      });

    nodes
      .transition()
      .ease(d3.easeCubic)
      .duration(250)
      .delay((d, i, nodes) => {
        return d.depth * 150;
      })
      .attr("fill", "lightblue")
      .attr("r", "0.3")
      .style("opacity", 1)
      .attr("cx", (d) => d.y)
      .attr("cy", (d) => d.x);

    d3.select(this.ref.value!)
      .selectAll("path")
      .data(t(tree))
      .join("path")
      .attr(
        "d",
        (d) =>
          d.parent &&
          d3.link(d3.curveBumpX)({
            target: [d.y, d.x],
            source: [d.parent.y, d.parent.x],
          })
      )
      .attr("stroke", "lightblue")
      .attr("stroke-width", "0.1")
      .attr("fill", "none")
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return length + " " + length;
      })
      .attr("stroke-dashoffset", function () {
        const length = this.getTotalLength();
        return length;
      })
      .transition()
      .ease(d3.easeCubicIn)
      .duration(250)
      .delay((d, i, nodes) => {
        return d.depth * 150;
      })
      .attr("stroke-dashoffset", 0);
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (this.ref.value) this.select(this.ref.value);
  }
  render() {
    return html`<div>
      <svg viewBox="-3 -3 50 50" ${ref(this.ref)}></svg>
    </div>`;
  }

  static styles = css`
    div {
      width: 100%;
      height: auto;
    }
  `;
}
