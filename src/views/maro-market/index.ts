import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, state } from "lit/decorators.js";
import * as d3 from "d3";
import { createRef, ref } from "lit/directives/ref.js";
import { range } from "d3";
import { maxBy, uniqueId } from "lodash";
import produce from "immer";

const itemList = `
Central offices 6/8/74 in custody within portfolios, certificate 149503.
1 monolith ring Brilliant 7 karats
1 monolith ring ruby
1 monolith ring brilliant Maro’s (6 karats)
1 brooch brilliant
2 pairs of earrings brilliant
1 necklace brilliant
2 watches brilliant one of Maro’s
1 ring brilliant Maro’s
1 gold ring with brilliant, Maro’s
1 pearl necklace 3 rows
1 pearl necklace 2 rows
1 pearl necklace one row
1 pearl necklace one row
4 gold chains, Maro’s
2 gold bracelets
1 box with gold coins
2 gold sets of postage cards
1 gold watch Maro’s
2 gold chains Maro’s
2 PARKER pens
1 PARKER PENCIL             
1 gold lighter
1 TALL BOY later
Proof sets cash 1919
And more smaller things and objects
`.split("\n");

@customElement("maro-market")
export class MaroMarket extends LitElement {
  ref = createRef<SVGElement>();
  worker?: Worker;

  @state()
  modelState: any = [];

  @state()
  chars = Object.fromEntries(
    Object.values(CharType).map((c) => [c, { name: c, weight: Math.random() }])
  );

  connectedCallback() {
    super.connectedCallback();
    this.worker = new Worker(new URL("./learning.worker.ts", import.meta.url), {
      type: "module",
    });
    this.worker?.addEventListener("message", (e) => (this.modelState = e.data));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.worker?.terminate();
  }

  updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    super.updated(_changedProperties);
    this.ref.value!.innerHTML = "";
    const r = new BasicRenderer();
    const p = new BasicPieceGen();
    const e = new BasicElemGen(Object.values(this.chars));
    const parent = e.genNode();
    parent.children = [e.genNode(), e.genNode(), e.genNode()];
    const g = r.render(this.ref.value!, parent);
    g.attr("transform", "translate(100, 60)");
  }

  render() {
    return html`
      <header>
        <h-title>gems by maro we mean evi for maro</h-title>
        <h-title l="2"
          >biogold alloy,stock,brilliant jem,4carrot scrubber with
          built-in</h-title
        >
      </header>
      <form>
        ${Object.values(CharType).map(
          (c) => html`
            <label for="${c}">${c}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              @input=${(e) =>
                (this.chars = produce((chars) => {
                  chars[c] = {
                    name: c,
                    weight: parseFloat(e.currentTarget.value),
                  };
                })(this.chars))}
            />
          `
        )}
      </form>
      <svg
        viewBox="0 0 240 160"
        width="600"
        height="400"
        ${ref(this.ref)}
      ></svg>
      <p>${this.modelState}</p>
    `;
  }
}

type PieceGenConfig = {
  nodeGens: ElemGen[];
};

interface PieceGen {
  getPiece(config: PieceGenConfig): Piece;
}

interface ElemRenderer {
  render(
    parent: SVGElement,
    elem: PieceElem
  ): d3.Selection<any, unknown, SVGElement, unknown | undefined>;
}

interface ElemGen {
  characteristicWeights: { name: string; weight: number }[];
  genNode(): PieceElem;
}

interface PieceElem {
  aspects: Aspect[];
  children: PieceElem[];
}

interface Aspect<A extends AspectType = AspectType> {
  name: A;
  characteristics: Characteristic[];
}

enum AspectType {
  Shape = "shape",
  Material = "material",
  Connection = "connection",
}

enum CharType {
  Brilliance = "brilliance",
  Size = "size",
}

interface Characteristic {
  name: CharType;
  strength: number;
}

interface Piece {
  elems: PieceElem[];
}

class BasicElemGen implements ElemGen {
  characteristicWeights;

  constructor(characteristicWeights: { name: CharType; weight: number }[]) {
    this.characteristicWeights = characteristicWeights;
  }

  genNode(): PieceElem {
    const aspects: Aspect[] = [];
    for (const aspectType of Object.values(AspectType)) {
      const strength = Math.random();
      const chars = this.characteristicWeights.map(({ name, weight }) => ({
        name,
        strength: strength * weight,
      }));
      aspects.push({ name: aspectType, characteristics: chars });
    }
    return {
      aspects,
      children: [],
    };
  }
}

class BasicPieceGen implements PieceGen {
  getPiece(config: PieceGenConfig): Piece {
    return { elems: config.nodeGens.map((gen) => gen.genNode()) };
  }
}

interface AspectRenderFn<A extends AspectType, Elem extends SVGElement> {
  (
    selection: d3.Selection<Elem, unknown, SVGGElement, unknown>,
    aspect: Aspect<A>,
    elem: PieceElem
  ): void;
}

const renderPathMaterial: AspectRenderFn<AspectType.Shape, SVGPathElement> = (
  selection,
  material
) => {
  const color = d3.hsl("hsl(315, 100%, 28%)");
  let size = 44;
  material.characteristics.forEach((c) => {
    switch (c.name) {
      case CharType.Brilliance: {
        color.l = c.strength;
        break;
      }
      case CharType.Size: {
        size += c.strength * 66;
      }
    }
  });
  const id = uniqueId();
  d3.select(selection.node()?.parentNode!).append("defs").html(`
<radialGradient id="ffflux-gradient-${id}">
  <stop offset="0%" stop-color="${color}"></stop>
  <stop offset="${Math.floor(size)}%" stop-color="hsl(227, 100%, 5%)"></stop>
</radialGradient>
    `);
  selection.attr("fill", `url(#ffflux-gradient-${id})`);
};

const renderPathShape: AspectRenderFn<AspectType.Shape, SVGPathElement> = (
  selection,
  shape
) => {
  const lineR = d3.lineRadial();
  lineR.curve(d3.curveBasisClosed);
  let data: number[] = range(30).map(() => 30);
  shape.characteristics.forEach((char) => {
    switch (char.name) {
      case CharType.Size: {
        data = data.map((y) => y + char.strength * 10 - 5);
        break;
      }
      case CharType.Brilliance: {
        data = data.map(
          (y, i) =>
            y -
            char.strength * 10 +
            (0.5 +
              Math.sin(
                (i / data.length) * Math.PI * 10000 * (char.strength - 0.5)
              )) *
              10 *
              (char.strength - 0.5) *
              10
        );
        break;
      }
    }
  });
  selection.attr(
    "d",
    lineR(data.map((y, i) => [(i / data.length) * Math.PI * 2, y]))
  );
};

const renderConnection: AspectRenderFn<AspectType.Connection, SVGGElement> = (
  selection,
  connection,
  elem
) => {
  const sizeStrength = connection.characteristics.find(
    (char) => char.name === CharType.Size
  )?.strength;
  const radius = (sizeStrength ?? 1) * 40;
  const brillStrength = connection.characteristics.find(
    (char) => char.name === CharType.Brilliance
  )?.strength;
  const data = elem.children.map((child, i) => {
    const position = [
      Math.cos((i / elem.children.length) * Math.PI * 2) * radius,
      Math.sin((i / elem.children.length) * Math.PI * 2) * radius,
    ];
    return { position };
  });
  for (const child of elem.children) {
    const g = new BasicRenderer().render(selection.node()!, child);
  }
  const sizes = elem.children
    .map((child) =>
      child.aspects
        .find((a) => a.name === AspectType.Shape)
        ?.characteristics.find((c) => c.name === CharType.Size)
    )
    .filter((s) => s);
  const maxChildSize = maxBy(sizes, (c) => c?.strength ?? 0);
  const thisShapeSize = elem.aspects
    .find((a) => a.name === AspectType.Shape)
    ?.characteristics.find((c) => c.name === CharType.Size);
  let scaleFactor = 1;
  if (maxChildSize && thisShapeSize) {
    scaleFactor =
      thisShapeSize.strength / (sizeStrength ?? 0 + maxChildSize.strength / 2);
  }
  selection
    .selectAll("g")
    .data(data)
    .attr(
      "transform",
      (d) =>
        `translate(${d.position[0]}, ${d.position[1]}) scale(${scaleFactor})`
    );
};

class BasicRenderer implements ElemRenderer {
  render(parent: SVGElement, elem: PieceElem) {
    const elemNode = d3
      .select(parent)
      .append("g")
      .attr("transform", "translate(30, 30)");
    const connectAspect = elem.aspects.find(
      (a) => a.name === AspectType.Connection
    );
    if (connectAspect) renderConnection(elemNode, connectAspect, elem);
    const path = elemNode
      .selectChildren("path")
      .data([1] as unknown[])
      .join("path");
    elem.aspects.forEach((aspect) => {
      switch (aspect.name) {
        case AspectType.Shape: {
          renderPathShape(path, aspect as any, elem);
          break;
        }
        case AspectType.Material: {
          renderPathMaterial(path, aspect as any, elem);
          break;
        }
      }
    });
    return elemNode;
  }
}
