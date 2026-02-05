import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "path";
import { appRouter } from "@newformdemo/trpc";
import uploadRouter from "./routes/upload";
import genAIStreamsRouter from "./routes/genaiastreams";
import { prisma } from "lib/prisma";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/upload", uploadRouter);
app.use("/api/genaistreams", genAIStreamsRouter);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

app.get("/", async (req, res) => {
  const ans = await prisma.video.findMany({
    include: {
      hook: true,
      demographics: true,
      performance: true,
      ctaAnalysis: true,
      technicalQuality: true,
      vibes: true,
      keyMoments: true,
      suggestions: true,
      platformFit: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(ans);
});

app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "uploads/videos")),
);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({
      prisma,
    }),
  }),
);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
