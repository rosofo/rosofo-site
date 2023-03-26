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
