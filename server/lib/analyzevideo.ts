import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function analyzeVideo(videoId: number) {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    if (!video) {
      return "Video not found";
    }

    // Read video file
    const videoPath = path.join(
      __dirname,
      "../../uploads/videos",
      video.uniqueName
    );

    if (!fs.existsSync(videoPath)) {
      throw new Error("Video file not found");
    }

    const videoData = fs.readFileSync(videoPath);
    const base64Video = videoData.toString("base64");

    // Get file extension to determine mimetype
    const ext = path.extname(video.originalName).toLowerCase();
    const mimetypeMap: { [key: string]: string } = {
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
    };

    const mimetype = mimetypeMap[ext] || "video/mp4";

    // Enhanced prompt that produces streaming text AND structured JSON
    const enhancedPrompt = `IMPORTANT — FOLLOW EXACTLY.

You are streaming STATUS FEEDBACK ONLY.

For each section:
- Start with a markdown bold heading (**SECTION_NAME**)
- Output 2–4 short STATUS lines with emojis
- END the section with the token: <br>

STATUS lines:
- Must describe progress only (analyzing, evaluating, completed)
- Must NOT describe content, scenes, opinions, or insights
- Must NOT include numbers, timestamps, scores, or findings

Sections (in this exact order):
HOOK
VIBES
DEMOGRAPHICS
KEY MOMENTS
SUGGESTIONS

Example output (FORMAT MUST MATCH):

**HOOK**
🔍 Analyzing hook…
🧠 Evaluating attention capture…
✅ Hook analyzed.
<br>

**VIBES**
🔍 Analyzing vibes…
🎭 Identifying emotional tone…
✅ Vibes analyzed.


JSON OUTPUT (FINAL — NO MARKDOWN):
- After the status text, output JSON ONLY.
- Start with { and end with }.
- No text before or after.
- Must be valid JSON.

{
  "hookStrength": {
    "score": <number 0-10>,
    "reason": "<concise reason>",
    "description": "<detailed explanation>"
  },
  "vibes": [
    { "vibe": "<adjective>", "rate": <number 0-10> }
  ],
  "demographics": {
    "ageRange": "<age range>",
    "gender": "<target gender>",
    "interests": ["<interest1>", "<interest2>"]
  },
  "keyMoments": [
    { "timestamp": <seconds>, "reason": "<why important>" }
  ],
  "suggestions": [
    { "recommendation": "<action>", "reason": "<why>" }
  ]
}
`;
    return ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimetype,
                data: base64Video,
              },
            },
            {
              text: enhancedPrompt,
            },
          ],
        },
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(
      `Failed to analyze video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
