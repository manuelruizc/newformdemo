import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@newformdemo/trpc";
import uploadRouter from "./routes/upload";
import genAIStreamsRouter from "./routes/genaiastreams";
import { prisma } from "lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { createReadStream } from "lib/gcs";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/upload", uploadRouter);
app.use("/api/genaistreams", genAIStreamsRouter);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

app.get("/", async (req, res) => {
  // await prisma.video.delete({
  //   where: {
  //     id: 218,
  //   },
  // });
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

app.get("/uploads/videos/:objectName", async (req, res) => {
  try {
    const stream = createReadStream(req.params.objectName);
    stream.on("error", (err) => {
      console.error("GCS stream error:", err);
      if (!res.headersSent) res.status(404).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error("Video stream failed:", err);
    res.status(500).end();
  }
});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({
      prisma,
    }),
  })
);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
