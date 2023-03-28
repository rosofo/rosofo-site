import { Route, Router as VRouter } from "@vaadin/router";

export const router = new VRouter(document.getElementById("router-outlet"));
export const views: Route[] = [
  {
    name: "Stresswaves",
    path: "/stresswaves",
    component: "stress-waves",
    action: async () => {
      await import("./views/stresswaves");
    },
  },
  {
    name: "Hash Trees",
    path: "/hash-trees",
    component: "hash-trees-view",
    action: async () => {
      await import("./views/hash-trees");
    },
  },
  {
    name: "Pure D3",
    path: "/pure-d3",
    component: "pure-d3",
    action: async () => {
      await import("./views/pure-d3");
    },
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
