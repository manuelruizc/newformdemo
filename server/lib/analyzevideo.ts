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
PERFORMANCE PREDICTION
PLATFORM FIT
CTA ANALYSIS
TECHNICAL QUALITY
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
<br>

**DEMOGRAPHICS**
🔍 Analyzing demographics…
👥 Identifying target audience…
✅ Demographics analyzed.
<br>

**KEY MOMENTS**
🔍 Analyzing key moments…
⏱️ Detecting engagement peaks…
✅ Key moments identified.
<br>

**PERFORMANCE PREDICTION**
🔍 Predicting performance…
📊 Calculating engagement metrics…
✅ Performance prediction complete.
<br>

**PLATFORM FIT**
🔍 Analyzing platform compatibility…
📱 Evaluating algorithm alignment…
✅ Platform fit analyzed.
<br>

**CTA ANALYSIS**
🔍 Analyzing call-to-action…
🎯 Evaluating conversion effectiveness…
✅ CTA analysis complete.
<br>

**TECHNICAL QUALITY**
🔍 Analyzing technical quality…
🎬 Evaluating production values…
✅ Technical quality assessed.
<br>

**SUGGESTIONS**
🔍 Generating recommendations…
💡 Optimizing strategy…
✅ Suggestions ready.
<br>


JSON OUTPUT (FINAL — NO MARKDOWN):
- After the status text, output JSON ONLY.
- Start with { and end with }.
- No text before or after.
- Must be valid JSON.

ANALYSIS INSTRUCTIONS:

1. HOOK STRENGTH (0-10):
   - Evaluate first 3 seconds for attention capture
   - Consider: visual surprise, pattern interrupt, immediate value prop
   - Score high (7-10): Strong visual hook, clear context, emotional trigger
   - Score medium (4-6): Decent opening but lacks punch
   - Score low (0-3): Weak, confusing, or slow start

2. VIBES (3-5 adjectives with 0-10 ratings):
   - Emotional tone: energetic, authentic, playful, professional, urgent, inspirational
   - Rate intensity of each vibe
   - Consider: music, pacing, visual style, creator energy

3. DEMOGRAPHICS:
   - Age range: 13-17, 18-24, 25-34, 35-44, 45-54, 55+
   - Gender: Male-skewed, Female-skewed, Mixed, Neutral
   - Interests: 3-5 categories (fitness, fashion, tech, business, lifestyle, beauty, gaming, etc.)

4. KEY MOMENTS (2-4 timestamps):
   - Identify engagement peaks (visual hooks, product reveals, emotional beats, CTAs)
   - Timestamp in seconds (e.g., 1.5, 7.2)
   - Explain why each moment matters

5. PERFORMANCE PREDICTION:
   - Estimated CTR: 0-15% (based on hook strength, clarity, visual quality)
   - Engagement Rate: 0-30% (based on emotional resonance, shareability, relatability)
   - Virality Score: 0-10 (fast cuts + emotion + trend alignment = higher)
   - Confidence: high (similar to proven winners), medium (mixed signals), low (uncertain category)

6. PLATFORM FIT (score each 0-10):
   - TikTok: Fast cuts, trending audio, Gen Z language, authentic/raw feel
   - Instagram Reels: Aesthetic quality, polished production, influencer vibe
   - YouTube Shorts: Educational value, clear narrative, longer watch time OK
   - Recommend best platform based on highest score

7. CTA ANALYSIS:
   - Is there a clear call-to-action?
   - If yes: timestamp, type (Shop Now, Learn More, Link in Bio, Swipe Up, etc.)
   - Clarity score (0-10): How obvious is the ask?
   - Timing: Too early (<3s), Well-timed (5-8s), Too late (>10s)
   - Effectiveness: Does it match the content flow?
   - Improvement suggestion if weak/missing

8. TECHNICAL QUALITY:
   - Resolution quality: 1080p+, 720p, <720p
   - Lighting (0-10): Professional/natural (8-10), acceptable (5-7), poor/harsh (0-4)
   - Audio (0-10): Clear/professional (8-10), acceptable (5-7), muffled/distorted (0-4)
   - Editing (0-10): Smooth cuts/transitions (8-10), decent (5-7), jarring/amateur (0-4)
   - Mobile optimized: true (9:16, text legible) or false
   - Production issues: List any problems (shaky cam, poor framing, pixelation, etc.)

9. SUGGESTIONS (3-5 actionable improvements):
   - Each must have: recommendation (what to do) + reason (why it works)
   - Focus on: hook improvement, pacing, CTA optimization, technical fixes
   - Be specific and actionable (e.g., "Add text overlay at 0.5s" not "improve hook")
   - Prioritize high-impact changes

10. VIDEO METADATA:
   - Create a short to medium length title for the video
   - Create a description for the video

{
  "hookStrength": {
    "score": <number 0-10>,
    "reason": "<concise reason for score>",
    "description": "<detailed 2-3 sentence explanation>"
  },
  "vibes": [
    { "vibe": "<adjective>", "rate": <number 0-10> },
    { "vibe": "<adjective>", "rate": <number 0-10> },
    { "vibe": "<adjective>", "rate": <number 0-10> }
  ],
  "demographics": {
    "ageRange": "<age range>",
    "gender": "<target gender>",
    "interests": ["<interest1>", "<interest2>", "<interest3>"]
  },
  "keyMoments": [
    { "timestamp": <seconds>, "reason": "<why this moment matters>" },
    { "timestamp": <seconds>, "reason": "<why this moment matters>" }
  ],
  "performancePrediction": {
    "estimatedCTR": <number 0-15>,
    "estimatedEngagementRate": <number 0-30>,
    "viralityScore": <number 0-10>,
    "confidenceLevel": "<high|medium|low>",
    "reasoning": "<2-3 sentence explanation of predictions>"
  },
  "platformFit": {
    "bestPlatform": "<TikTok|Instagram Reels|YouTube Shorts>",
    "platformScores": {
      "tiktok": <number 0-10>,
      "instagramReels": <number 0-10>,
      "youtubeShorts": <number 0-10>
    },
    "reasoning": "<why this platform is best>"
  },
  "ctaAnalysis": {
    "ctaPresent": <boolean>,
    "ctaTimestamp": <number or null>,
    "ctaClarity": <number 0-10>,
    "ctaType": "<Shop Now|Learn More|Link in Bio|Swipe Up|Download|None>",
    "ctaTiming": "<Too early|Well-timed|Too late|No CTA>",
    "ctaEffectiveness": "<1-2 sentence evaluation>",
    "improvement": "<specific suggestion to improve CTA>"
  },
  "technicalQuality": {
    "videoResolution": "<1080p+|720p|<720p>",
    "lightingQuality": <number 0-10>,
    "audioClarity": <number 0-10>,
    "editingProfessionalism": <number 0-10>,
    "mobileOptimized": <boolean>,
    "productionIssues": ["<issue1>", "<issue2>"] // empty array if none
  },
  "suggestions": [
    { 
      "recommendation": "<specific actionable improvement>", 
      "reason": "<why this will improve performance>",
      "priority": "<high|medium|low>"
    },
    { 
      "recommendation": "<specific actionable improvement>", 
      "reason": "<why this will improve performance>",
      "priority": "<high|medium|low>"
    }
  ],
  "metadata": {
    "title": <Unique easy identifiable title>,
    "description": <Description/summary of the video ad>
  }
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
