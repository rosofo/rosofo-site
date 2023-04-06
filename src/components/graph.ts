import { BaseType, HierarchyPointNode, Selection } from "d3";
import * as d3 from "d3";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

@customElement("graph-vis")
export class GraphVis extends LitElement {
  ref = createRef<SVGElement>();
  zoom?: d3.ZoomBehavior<SVGElement, HierarchyPointNode<unknown>>;
  transitions: Promise<void>[] = [];

  select(svg: SVGElement) {
    if (!this.tree || !this.tree.length) return;
    const t = d3.tree().size([20, 20])(d3.stratify()(this.tree));
    const nodes = this.joinNodes(svg, t);

    const trans = joinEdges(svg, t)
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return length + " " + length;
      })
      .attr("stroke-dashoffset", function () {
        const length = this.getTotalLength();
        return length;
      })
      .transition("entry")
      .ease(d3.easeCubicIn)
      .duration(250)
      .delay((d, i, nodes) => {
        return d.depth * 150;
      })
      .attr("stroke-dashoffset", 0);

    this.transitions.push(trans.end());
  }
  addNodeInteraction(svg: SVGElement) {
    const nodes = d3.select(svg).selectAll("circle.node");
    const hoverNodes = d3
      .select(svg)
      .selectAll("circle.hover-node")
      .data(nodes.data())
      .join("circle")
      .classed("hover-node", true)
      .attr("cx", (d) => d.y)
      .attr("cy", (d) => d.x)
      .attr("r", 2)
      .style("opacity", 0);
    const elem = this;
    hoverNodes
      .on("mouseover", function (event, thisd) {
        elem.zoomNode(d3.select(this));
        const edges = d3.select(svg).selectAll("path");
        const parents = thisd.ancestors();
        elem.transitions.push(
          nodes
            .transition()
            .attr("fill", (d) => {
              return parents.map((p) => p.data.id).includes(d.data.id)
                ? "pink"
                : "lightblue";
            })
            .end()
        );
        elem.transitions.push(
          edges
            .transition()
            .attr("stroke", (d) => {
              return parents.map((p) => p.data.id).includes(d.data.id)
                ? "pink"
                : "lightblue";
            })
            .end()
        );
      })
      .on("mouseout", function (event, thisd) {
        elem.resetZoom();
        const edges = d3.select(svg).selectAll("path");
        const parents = thisd.ancestors();
        elem.transitions.push(
          nodes.transition().attr("fill", "lightblue").end()
        );
        elem.transitions.push(
          edges.transition().attr("stroke", "lightblue").end()
        );
      })
      .on("click", (e, d) => {
        this.transitions.push(this.resetZoom());
        this.transitionsEnd().then(() => {
          this.dispatchEvent(
            new CustomEvent("node-click", {
              detail: d as HierarchyPointNode<Tree[0]>,
            })
          );
        });
      });
  }
  joinNodes(svg: SVGElement, tree: HierarchyPointNode<unknown>) {
    const nodes = d3
      .select(svg)
      .selectAll("circle.node")
      .data(tree)
      .join("circle")
      .classed("node", true)
      .style("opacity", 0)
      .attr("cx", (d) => d.y)
      .attr("cy", (d) => d.x);
    const trans = nodes
      .transition("entry")
      .ease(d3.easeCubic)
      .duration(250)
      .delay((d, i, nodes) => {
        return d.depth * 150;
      })
      .on("interrupt", function () {
        d3.select(this).style("opacity", 1);
      })
      .attr("fill", "lightblue")
      .attr("r", "0.3")
      .style("opacity", 1);

    trans.end().then(() => this.addNodeInteraction(svg));

    this.transitions.push(trans.end());

    return nodes;
  }

  async transitionsEnd() {
    try {
      await Promise.all(this.transitions);
    } catch {}
    this.transitions = [];
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (this.ref.value) {
      const rect = this.ref.value!.getBoundingClientRect();
      this.select(this.ref.value);
      this.zoom = d3.zoom();
      this.zoom
        .on("zoom", ({ transform }) =>
          d3
            .select(this.ref.value!)
            .selectAll("*")
            .attr(
              "transform",
              `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
            )
        )
        .extent([
          [0, 0],
          [rect.x, rect.y],
        ])
        .translateExtent([
          [0, 0],
          [rect.x, rect.y],
        ]);
      d3.select(this.ref.value).call(this.zoom);
    }
  }
  zoomNode(
    node: Selection<BaseType, HierarchyPointNode<unknown>, null, unknown>
  ) {
    d3.select(this.ref.value!)
      .transition()
      .call(this.zoom!.scaleTo, 1.5, [node.attr("cx"), node.attr("cy")]);
  }

  resetZoom() {
    return d3
      .select(this.ref.value!)
      .transition()
      .call(this.zoom!.transform, d3.zoomIdentity)
      .end();
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
