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
type ViewHierarchy = (string | [string, ViewHierarchy])[];
const viewHierarchy: ViewHierarchy = [
  [
    "/",
    [
      "stress-waves",
      "hash-trees",
      "pure-d3",
      "maro-market",
      ["gfx-exp", ["robex-luv", "coord-sines"]],
    ],
  ],
];

const findViews = (hierarchy: ViewHierarchy) => {
  hierarchy.map;
};

export const router = new VRouter(document.getElementById("router-outlet"));
export const views: Route[] = findViews(viewHierarchy);
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
