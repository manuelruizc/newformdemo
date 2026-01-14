import { PrismaClient } from "../../server/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new (PrismaClient as any)();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const createTRPCContext = async () => {
  return {
    prisma,
    // You can add 'session' or 'user' here later
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
