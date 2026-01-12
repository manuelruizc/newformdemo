import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@newformdemo/trpc"; // This comes from your shared package!

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Running...");
});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(4000, () => {
  console.log("Server listening on http://localhost:4000");
});
