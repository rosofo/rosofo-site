import { Route } from "@vaadin/router";
import { views as gfxExp } from "./gfx-exp";

export const views: Route[] = [
  {
    path: "/gfx-exp",
    component: "gfx-exp",
    name: "gfx-exp",
    children: gfxExp,
    action: async () => {
      import("./gfx-exp");
    },
  },
  {
    path: "/hash-trees",
    component: "hash-trees",
    name: "hash-trees",
    action: async () => {
      import("./hash-trees");
    },
  },
  {
    path: "/maro-market",
    component: "maro-market",
    name: "maro-market",
    action: async () => {
      import("./maro-market");
    },
  },
];

export default views;
