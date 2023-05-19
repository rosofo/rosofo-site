import { Route, Router as VRouter } from "@vaadin/router";
import { createStore } from "zustand/vanilla";
import "./components/loading-overlay";
import views from "./views";

export const routingState = createStore<{
  isLoading: boolean;
  isError: boolean;
}>((set) => {
  return {
    isLoading: false,
    isError: false,
  };
});

export const router = new VRouter(document.getElementById("router-outlet"));
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
