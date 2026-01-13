import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
console.log("key", process.env.GEMINI_API_KEY!);

export async function analyzeVideo(
  videoId: number,
  prompt: string = "Describe what happens in this video in detail"
): Promise<string> {
  try {
    console.log({ videoId });
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
    console.log(videoPath);

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

    // Generate content with video
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Latest model
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
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            hookStrength: {
              type: "object",
              properties: {
                score: { type: "number" },
                reason: { type: "string" },
                description: { type: "string" },
              },
              required: ["score", "reason", "description"],
              description:
                "Score from 0-10 rating first 3 seconds and also give a concise reason and a description(longer) of why the hook has that score",
            },
            vibes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  rate: { type: "number" },
                  vibe: { type: "string" },
                },
                required: ["rate", "vibe"],
              },
              description:
                "3-5 adjectives describing the mood and define a rate 0-10 where 0 is bad and 10 is perfect",
            },
            demographics: {
              type: "object",
              properties: {
                ageRange: { type: "string" },
                gender: { type: "string" },
                interests: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["ageRange", "gender", "interests"],
            },
            keyMoments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "number" },
                  reason: { type: "string" },
                },
                required: ["timestamp", "reason"],
              },
              description: "3-5 key moments in the ad",
            },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  recommendation: { type: "string" },
                  reason: { type: "string" },
                },
                required: ["recommendation", "reason"],
              },
              description:
                "3-5 actionable recommendations and the reason why is being recommended",
            },
          },
          required: [
            "hookStrength",
            "vibes",
            "demographics",
            "keyMoments",
            "suggestions",
          ],
        },
      },
    });

    return response.text || "Was not possible to analyze the video";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(
      `Failed to analyze video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
