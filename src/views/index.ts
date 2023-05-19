import { Route } from "@vaadin/router";

const views: Route[] = [
  {
    path: "/gfx-exp",
    component: "gfx-exp",
    name: "gfx-exp",
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
