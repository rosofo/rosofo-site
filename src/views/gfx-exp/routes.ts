import { Route } from "@vaadin/router";

export const routes: Route[] = [
  {
    path: "robex-luv",
    component: "robex-luv",
    name: "robex-luv",
    action: async () => {
      await import("./robex-luv");
    },
  },
  {
    path: "coord-sines",
    component: "coord-sines",
    name: "coord-sines",
    action: async () => {
      await import("./coord-sines");
    },
  },
];
