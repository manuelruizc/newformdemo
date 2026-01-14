import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { prisma } from "../../../server/lib/prisma";

const HookFilterEnum = z.enum(["all", "hook-high", "hook-medium", "hook-low"]);
const SortByEnum = z.enum(["newest", "oldest", "hook-high", "hook-low"]);

export const videoRouter = router({
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const videoData = await prisma.video.findFirst({
        where: {
          id: input.id,
        },
      });
      if (videoData === null) {
        return {
          success: true,
        };
      }
      const videoPath = path.join(
        __dirname,
        "../../server/uploads/videos",
        videoData.uri
      );

      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }

      await prisma.video.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),

  searchAndFilter: publicProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        filterBy: HookFilterEnum,
        sortBy: SortByEnum,
      })
    )
    .query(async ({ input, ctx }) => {
      const { searchTerm, filterBy, sortBy } = input;

      const where: any = {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      };

      if (filterBy !== "all") {
        where.priority = filterBy;
      }
      let orderBy: any = {};

      switch (sortBy) {
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "hook-high":
          orderBy = { priority: "desc" };
          break;
        case "hook-low":
          orderBy = { priority: "asc" };
          break;
      }

      const videos = await prisma.video.findMany({
        where: {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        orderBy,
      });

      return videos;
    }),

  totalStats: publicProcedure.query(async () => {
    try {
      // const
    } catch (e) {}
  }),
});
