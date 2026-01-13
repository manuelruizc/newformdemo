import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { videoRouter } from "./routers/video";

const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const router = t.router;

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        text: `Hello ${input.name}, tRPC is working!`,
      };
    }),
  video: videoRouter,
});

export type AppRouter = typeof appRouter;
