import express from "express";
import { analyzeVideo } from "lib/analyzevideo";
const router = express.Router();

router.get("/analyze_video/:id", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const id = Number(req.params.id);
    const stream = await analyzeVideo(id);

    let fullText = "";
    let reasoningBuffer = "";
    let jsonStarted = false;
    let lastIndex = 0;

    for await (const chunk of stream) {
      const text =
        typeof chunk === "string"
          ? chunk
          : typeof chunk?.text === "string"
          ? chunk.text
          : "";

      if (!text) continue;

      fullText += text;

      // ===== BEFORE JSON (REASONING STREAM) =====
      if (!jsonStarted) {
        const jsonStart = fullText.indexOf("{");

        // Still reasoning
        if (jsonStart === -1) {
          const newContent = fullText.slice(lastIndex);
          lastIndex = fullText.length;

          if (newContent) {
            reasoningBuffer += newContent;

            // Flush ONLY when we have a semantic break
            if (reasoningBuffer.includes("\n\n")) {
              res.write(
                `event: reasoning\ndata: ${JSON.stringify(reasoningBuffer)}\n\n`
              );
              reasoningBuffer = "";
            }
          }
          continue;
        }

        // ===== JSON DETECTED =====
        const reasoningPart = fullText.slice(lastIndex, jsonStart);
        if (reasoningPart) {
          reasoningBuffer += reasoningPart;
          res.write(
            `event: reasoning\ndata: ${JSON.stringify(reasoningBuffer)}\n\n`
          );
          reasoningBuffer = "";
        }

        jsonStarted = true;
      }

      // ===== JSON PHASE =====
      if (jsonStarted) {
        const jsonText = fullText.slice(fullText.indexOf("{"));

        try {
          const parsed = JSON.parse(jsonText);

          res.write(`event: result\ndata: ${JSON.stringify(parsed)}\n\n`);
          res.write(`event: done\ndata: [DONE]\n\n`);
          res.end();
          return;
        } catch {
          // JSON not complete yet — keep buffering
          continue;
        }
      }
    }
  } catch (err) {
    console.error("Analysis error:", err);
    res.write(
      `event: error\ndata: ${JSON.stringify({
        message: err instanceof Error ? err.message : "Unknown error",
      })}\n\n`
    );
    res.end();
  }
});

export default router;
