import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@newformdemo/trpc";
import uploadRouter from "./routes/upload";
import { prisma } from "lib/prisma";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/upload", uploadRouter);

app.get("/", async (req, res) => {
  const a = await prisma.video.findMany();
  res.json(a);
});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
