import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { videoRouter } from "./routers/video";
import { createTRPCContext } from "./prismacontext";

const t = initTRPC.create();

export const appRouter = t.router({
  video: videoRouter,
});

export type AppRouter = typeof appRouter;
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
