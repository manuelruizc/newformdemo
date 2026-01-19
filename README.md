# Technical Demo: Automated Video Analysis Platform

This project demonstrates a full-stack application designed to ingest short-form video content, process it via multimodal AI, and store structured metadata for querying and analysis.

## Tech Stack & Architecture

- **Frontend:** Next.js 16 (React 19), Tailwind CSS 4, Radix UI.
- **Backend:** Node.js with Express, tRPC for API layer.
- **Database:** PostgreSQL with Prisma ORM.
- **AI/ML:** Gemini 2.5 (Multimodal)

## Core Implementation Details

### 1. End-to-End Type Safety

The application uses **tRPC** to share types directly between the backend and frontend. This ensures that the AI analysis results stored in the database exactly match the TypeScript interfaces used in the UI components, eliminating runtime type errors.

Note: Because tRPC is primarily designed for JSON-based procedures, I implemented a dedicated Express endpoint to handle the video file uploads.

### 2. AI Processing Pipeline

The system uses a strict "Status + JSON" protocol. The AI streams human-readable status updates first (for UI feedback), followed by a strictly formatted JSON object.

- **Input:** Video URL/File.
- **Process:** Frame sampling & Multimodal analysis.
- **Output:** Validated JSON against a Zod schema.

### 3. Data Schema & Analysis Output

The core value of the demo is the structured data extraction. Below is the JSON schema used to normalize the unstructured video data into queryable fields in PostgreSQL.

```json
{
  "hookStrength": {
    "score": 8, // Integer 0-10
    "reason": "Strong visual pattern interrupt in first 0.5s",
    "description": "The video starts with a rapid zoom effect that immediately captures attention."
  },
  "demographics": {
    "ageRange": "25-34",
    "gender": "Neutral",
    "interests": ["Tech", "Remote Work", "Productivity"]
  },
  "performancePrediction": {
    "estimatedCTR": 3.5,
    "confidenceLevel": "high",
    "viralityScore": 7
  },
  "platformFit": {
    "bestPlatform": "TikTok",
    "platformScores": {
      "tiktok": 9,
      "instagramReels": 7,
      "youtubeShorts": 6
    }
  },
  "metadata": {
    "title": "Day in the Life - Remote Dev",
    "description": "A 15s short showcasing the workspace setup."
  }
}
```

### 4. Database Strategy

Using **Prisma** with **PostgreSQL**, the JSON data above is mapped to relational tables. This allows for complex filtering that would be impossible with raw video files, such as:

- _"Show all videos"_
- _"Cursor-based pagination"_
- _"Filter by oldest, newest, strongest hook and weakest hook"_
- _"Sort by Hook strength (high, medium, low, all)"_

### **Execution Requirements**

To run the analysis engine and database locally, the following environment variables must be configured in your `.env`(this should be at the root of the project) file:

- `DATABASE_URL`: Your PostgreSQL connection string (used by Prisma).
- `GEMINI_API_KEY`: Your Google AI Studio API key for video processing.
