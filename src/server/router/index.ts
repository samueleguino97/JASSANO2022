// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { jasRouter } from "./jas";
import { stakesRoutes } from "./stakes";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("jas.", jasRouter)
  .merge("area.", jasRouter)
  .merge("stakes.", stakesRoutes);
// export type definition of API
export type AppRouter = typeof appRouter;
