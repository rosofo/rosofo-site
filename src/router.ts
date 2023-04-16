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

export const router = new VRouter(document.getElementById("router-outlet"));
export const views: Route[] = [
  {
    path: "/",
    name: "/",
    animate: true,
    component: "loading-overlay",
    children: await Promise.all(
      ["stress-waves", "hash-trees", "pure-d3", "maro-market", "gfx-exp"].map(
        async (component) => {
          const childRoutesMod = Object.entries(viewModules).find(
            ([path]) => path === `./views/${component}/routes.ts`
          );
          let children: Route[] = [];
          if (childRoutesMod) {
            children = ((await childRoutesMod[1]()) as any).routes;
          }
          return {
            path: component,
            component,
            children,
            name: component,
            action: async (context, commands) => {
              routingState.setState({ isLoading: true, isError: false });
              const entry = Object.entries(viewModules).find(([name]) =>
                name.match(`views\/${component}(\.ts|\/index\.ts)`)
              );
              if (!entry) {
                console.log("could not find module");
                routingState.setState({ isLoading: false, isError: true });
              } else {
                await entry[1]();
                routingState.setState({ isLoading: false });
              }
            },
          };
        }
      )
    ),
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
