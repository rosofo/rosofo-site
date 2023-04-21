import { Route, Router as VRouter } from "@vaadin/router";
import { createStore } from "zustand/vanilla";
import "./components/loading-overlay";

export const routingState = createStore<{
  isLoading: boolean;
  isError: boolean;
}>((set) => {
  return {
    isLoading: false,
    isError: false,
  };
});

const viewModules = import.meta.glob("./**/views/**/*.ts");
const viewHierarchy = [
  "/",
  [
    "stress-waves",
    "hash-trees",
    "pure-d3",
    "maro-market",
    ["gfx-exp", ["robex-luv", "coord-sines"]],
  ],
];

export const router = new VRouter(document.getElementById("router-outlet"));
export const views: Route[] = [
  {
    path: "/",
    name: "/",
    animate: true,
    component: "loading-overlay",
    children: [
      "stress-waves",
      "hash-trees",
      "pure-d3",
      "maro-market",
      "gfx-exp",
    ].map((name) => {
      const found = Object.entries(viewModules).find(
        ([viewName]) => name === viewName
      );
      let action;
      if (found) {
        action = found[1]();
      }
      return {
        component: name,
        name,
        path: name,
        action,
      };
    }),
  },
];
router.setRoutes([
  ...views,
  {
    path: "/404",
    action: async () => {
      await import("./views/not-found-view");
    },
    component: "not-found-view",
  },
  {
    path: "(.*)",
    redirect: "/404",
  },
]);
