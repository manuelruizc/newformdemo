import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@newformdemo/trpc";

export const trpc = createTRPCReact<AppRouter>();
