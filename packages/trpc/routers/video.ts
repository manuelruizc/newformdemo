import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { prisma } from "../../../server/lib/prisma";
import { analyzeVideo } from "../../../server/lib/analyzevideo";

const PROMPT = `Analyze this TikTok ad creative. Focus on:
    1. Hook Strength (0-10): How engaging are the first 3 seconds?
    2. Vibes: 3-5 adjectives describing the emotional tone
    3. Demographics: Who would this appeal to?
    4. Key Moments: Timestamps where engagement peaks`;

export const videoRouter = router({
  analyzeVideo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        uniqueName: z.string(),
        originalName: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const videoCreated = await prisma.video.update({
        data: {
          //   uri: "",
        },
        where: {
          id: input.id,
        },
      });
      const llmAnalysis = await analyzeVideo(input.id, PROMPT);
      return {
        id: videoCreated.id,
        filename: videoCreated.originalName,
        originalName: input.originalName,
        title: input.title || input.originalName,
        description: input.description,
        createdAt: new Date(),
        analysis: llmAnalysis,
      };
    }),

  getByFilename: publicProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        filename: input.filename,
      };
    }),

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
});
