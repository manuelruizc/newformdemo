import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { prisma } from "../../../server/lib/prisma";
import { Prisma } from "server/generated/prisma/client";

const HookFilterEnum = z.enum(["all", "high", "medium", "low"]);
const SortByEnum = z.enum(["newest", "oldest", "hook-high", "hook-low"]);

export const videoRouter = router({
  saveAnalysis: publicProcedure
    .input(
      z.object({
        videoId: z.number(),
        analysis: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { videoId, analysis } = input;

        // We use a single update with nested creates/upserts
        return await ctx.prisma.video.update({
          where: { id: videoId },
          data: {
            title: input.analysis.metadata.title,
            description: input.analysis.metadata.description,
            // 1:1 Relationship - Hook
            hook: {
              upsert: {
                create: {
                  hookStrength: analysis.hookStrength.score,
                  reason: analysis.hookStrength.reason,
                  description: analysis.hookStrength.description,
                },
                update: {
                  hookStrength: analysis.hookStrength.score,
                  reason: analysis.hookStrength.reason,
                  description: analysis.hookStrength.description,
                },
              },
            },

            // 1:1 Relationship - Demographics
            demographics: {
              upsert: {
                create: {
                  ageRange: analysis.demographics.ageRange,
                  gender: analysis.demographics.gender,
                  interests: analysis.demographics.interests,
                },
                update: {
                  ageRange: analysis.demographics.ageRange,
                  gender: analysis.demographics.gender,
                  interests: analysis.demographics.interests,
                },
              },
            },

            // 1:1 Relationship - Platform Fit (Flattening the nested scores)
            platformFit: {
              upsert: {
                create: {
                  bestPlatform: analysis.platformFit.bestPlatform,
                  reasoning: analysis.platformFit.reasoning,
                  tiktokScore: analysis.platformFit.platformScores.tiktok,
                  reelsScore:
                    analysis.platformFit.platformScores.instagramReels,
                  shortsScore:
                    analysis.platformFit.platformScores.youtubeShorts,
                },
                update: {
                  bestPlatform: analysis.platformFit.bestPlatform,
                  reasoning: analysis.platformFit.reasoning,
                  tiktokScore: analysis.platformFit.platformScores.tiktok,
                  reelsScore:
                    analysis.platformFit.platformScores.instagramReels,
                  shortsScore:
                    analysis.platformFit.platformScores.youtubeShorts,
                },
              },
            },

            // 1:1 Relationship - Performance Prediction
            performance: {
              upsert: {
                create: {
                  estimatedCTR: analysis.performancePrediction.estimatedCTR,
                  engagementRate:
                    analysis.performancePrediction.estimatedEngagementRate,
                  viralityScore: analysis.performancePrediction.viralityScore,
                  confidence: analysis.performancePrediction.confidenceLevel,
                  reasoning: analysis.performancePrediction.reasoning,
                },
                update: {
                  estimatedCTR: analysis.performancePrediction.estimatedCTR,
                  engagementRate:
                    analysis.performancePrediction.estimatedEngagementRate,
                  viralityScore: analysis.performancePrediction.viralityScore,
                  confidence: analysis.performancePrediction.confidenceLevel,
                  reasoning: analysis.performancePrediction.reasoning,
                },
              },
            },

            // 1:N Relationship - Vibes (Delete existing then create new)
            vibes: {
              deleteMany: {},
              create: analysis.vibes.map((v: any) => ({
                vibe: v.vibe,
                rate: v.rate,
              })),
            },

            // 1:N Relationship - Key Moments
            keyMoments: {
              deleteMany: {},
              create: analysis.keyMoments.map((km: any) => ({
                timestamp: km.timestamp,
                reason: km.reason,
              })),
            },

            // 1:N Relationship - Suggestions
            suggestions: {
              deleteMany: {},
              create: analysis.suggestions.map((s: any) => ({
                recommendation: s.recommendation,
                reason: s.reason,
                priority: s.priority,
              })),
            },
          },
          // This ensures the returned object contains all the new data for your UI
          include: {
            hook: true,
            vibes: true,
            demographics: true,
            platformFit: true,
            performance: true,
            keyMoments: true,
            suggestions: true,
          },
        });
      } catch (e) {
        console.error(e);
      }
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

  searchAndFilter: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().optional().default(""),
        filterBy: HookFilterEnum,
        sortBy: SortByEnum,
        limit: z.number().min(1).max(100).default(12),
        cursor: z.number().optional(), // ✅ Changed from z.string() to z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { searchTerm, filterBy, sortBy, limit, cursor } = input;

      const where: Prisma.VideoWhereInput = {
        // This is the "AND" safeguard for all 4 relations
        demographics: { isNot: null },
        performance: { isNot: null },
        platformFit: { isNot: null },
      };

      if (searchTerm && searchTerm.trim() !== "") {
        where.OR = [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ];
      }

      if (filterBy !== "all") {
        where.hook = {
          is: {
            hookStrength: {
              gte: filterBy === "high" ? 7 : filterBy === "medium" ? 4 : 0,
              lte: filterBy === "high" ? 10 : filterBy === "medium" ? 6 : 3,
            },
          },
        };
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
          orderBy = { hook: { hookStrength: "desc" } };
          break;
        case "hook-low":
          orderBy = { hook: { hookStrength: "asc" } };
          break;
      }

      const videos = await prisma.video.findMany({
        where,
        orderBy,
        take: limit + 1,
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }),
        include: {
          hook: true,
          vibes: true,
          demographics: true,
          performance: true,
          platformFit: true,
          keyMoments: true,
          suggestions: true,
        },
      });

      let nextCursor: number | undefined = undefined;
      if (videos.length > limit) {
        const nextItem = videos.pop();
        nextCursor = nextItem!.id;
      }

      return {
        videos,
        nextCursor,
      };
    }),

  totalStats: publicProcedure.query(async () => {
    try {
      // const
    } catch (e) {}
  }),
});
