import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@newformdemo/trpc";
import uploadRouter from "./routes/upload";
import genAIStreamsRouter from "./routes/genaiastreams";
import { prisma } from "lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { createReadStream, getObjectSize } from "lib/gcs";

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
    const { objectName } = req.params;
    const size = await getObjectSize(objectName);
    const range = req.headers.range;

    const mimeFromExt = (name: string) => {
      const ext = name.toLowerCase().split(".").pop();
      switch (ext) {
        case "mp4":
          return "video/mp4";
        case "webm":
          return "video/webm";
        case "mov":
          return "video/quicktime";
        default:
          return "application/octet-stream";
      }
    };
    const contentType = mimeFromExt(objectName);

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        res.status(416).set("Content-Range", `bytes */${size}`).end();
        return;
      }
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : size - 1;
      if (start >= size || end >= size || start > end) {
        res.status(416).set("Content-Range", `bytes */${size}`).end();
        return;
      }
      res.status(206).set({
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": contentType,
      });
      const stream = createReadStream(objectName, { start, end });
      stream.on("error", (err) => {
        console.error("GCS stream error:", err);
        if (!res.headersSent) res.status(500).end();
      });
      stream.pipe(res);
      return;
    }

    res.set({
      "Content-Length": size,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
    });
    const stream = createReadStream(objectName);
    stream.on("error", (err) => {
      console.error("GCS stream error:", err);
      if (!res.headersSent) res.status(404).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error("Video stream failed:", err);
    if (!res.headersSent) res.status(500).end();
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
