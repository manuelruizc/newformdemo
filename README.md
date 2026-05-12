# Creative Intelligence

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](#license)

**Open-source video ad analyzer. Drop in any short-form creative and get back the hook, the audience, the creative pattern, and the scripting cues — in seconds.**

A working reference for performance marketers and creative strategists who are tired of black-box "AI creative scores" — and for engineers who want to see what a focused, single-model approach to creative intelligence actually looks like.

> Demo video / GIF coming on launch — drop a 15-second ad in, watch a full structured breakdown stream back in under 30 seconds.

---

## Why this exists

I built this on my own initiative — to prove out what AI-powered creative intelligence could look like as a working product, not a deck. The premise: **use AI to read a video ad the way a senior creative strategist would.** Hook, audience, pattern, scripting cues. Structured output. Fast enough to run on every asset, not just the winners.

It happened before the current wave of "AI creative analysis" tools landed on the market. The team at [NewForm](https://newform.ai) — the data-driven creative company — saw it, recognized the direction, and backed open-sourcing it.

So here it is. The whole prompt is in the repo. The 13 categories are documented below. Fork it, tear it apart, point it at your own ads.

---

## What it does

Drop in a `.mp4` or `.webm` (up to 60 MB, 2m 30s) and the analyzer streams back:

- **The Hook** — the opening line(s) designed to stop the scroll, surfaced verbatim
- **Hook category** — classified into one of 13 plain-language creative patterns (see below)
- **Key phrases** — the load-bearing lines inside the ad, each tagged by category
- **Target audience** — age range, gender lean, awareness level, primary pain point
- **CTA language** — the literal call-to-action used, ready to test variations against
- **Format notes** — pacing, cuts, on-screen text, what's earning the attention
- **Scripting tips** — concrete rewrite suggestions tied to each element of the breakdown
- **Performance prediction** — estimated CTR, engagement rate, virality score, with reasoning

Browse, sort, search, and filter every analyzed ad in a clean dashboard. Surface your strongest hooks. Re-run the analysis when you tighten the prompt.

---

## The 13 creative categories

Every hook is classified against the same 13-category framework. No black-box scoring — the categories are plain language and the model has to pick one (or surface a hybrid).

| Category | What it is |
|---|---|
| **Pattern Interrupt** | Breaks the scroll with something unexpected — bold visual, jarring statement, sudden cut |
| **Relatability** | Mirrors the viewer's specific frustration or moment so they think "that's me" |
| **Objection Busting** | Addresses the most common reason someone wouldn't buy, head-on, in the first second |
| **Before and After** | Shows the transformation: their current state vs. life with the product |
| **Curiosity Gap** | Opens a loop the viewer needs to close, withholds the answer until the payoff |
| **Social Proof** | Real users, real numbers, real outcomes — anchored in evidence |
| **Authority** | Expert voice, credentialed source, or institutional weight |
| **Aspiration** | Casts the product as the path to a desired identity or status |
| **Utility / Hack** | A practical tip or shortcut where the product is the obvious next step |
| **Emotional Trigger** | Joy, anger, fear, longing — direct emotional pull, no premise needed |
| **Hot Take** | A contrarian or polarizing opinion that demands a reaction |
| **Trend Hijack** | Latches onto a current cultural moment, format, or audio |
| **FOMO** | Scarcity, deadlines, "everyone's switching" — the cost of not acting now |

---

## How it works

A small, opinionated pipeline. No agents, no chains, no orchestration layer — just one model call doing the work.

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Browser    │──▶ │   Upload to  │──▶ │  Gemini      │──▶ │  Structured  │
│  drag-drop   │    │  GCS bucket  │    │  watches +   │    │  JSON streams│
│              │    │              │    │  reasons     │    │  to client   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                     │
                                                                     ▼
                                                            ┌──────────────┐
                                                            │  Postgres    │
                                                            │  for browse  │
                                                            │  + filter    │
                                                            └──────────────┘
```

1. **Upload** — the video streams directly to a Google Cloud Storage bucket. The Node server holds a buffer briefly, never writes to disk.
2. **Analyze** — Gemini watches the video frame-by-frame and is prompted against the 13-category creative framework. The prompt is in [server/lib/analyzevideo.ts](server/lib/analyzevideo.ts) — it's not magic, you can read it and tune it.
3. **Stream** — the model's reasoning is streamed back to the client over Server-Sent Events. The user sees the analysis being written, not a loading spinner for 30 seconds.
4. **Persist** — once the structured JSON is complete, it's parsed and saved to Postgres via Prisma. The dashboard re-renders with the new ad at the top.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express, tRPC, TypeScript |
| AI | Google Gemini (video understanding) |
| Database | PostgreSQL via Prisma 7 |
| Storage | Google Cloud Storage |
| Streaming | Server-Sent Events for real-time reasoning |
| Design | NewForm Design System (`nfds/`) |

### Roadmap

- **Meta Ads API integration** — pull live ad performance and cross-reference the AI breakdown with actual spend, CTR, and ROAS to validate predictions against reality
- **TikTok Ads API** — same loop, different platform
- **A/B variant generator** — feed an existing winner and have the model write 5 new hook variants in the same category
- **Bulk analysis** — point at a Meta Ads account and analyze the top 100 ads by spend in one click

---

## Getting started

```bash
git clone https://github.com/<your-org>/newformdemo.git
cd newformdemo
npm install
```

### Environment

Two `.env` files, one each in `client/` and `server/`. Templates are checked in as `.env.example`.

**`server/.env`** — Postgres + Gemini + GCS credentials:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/newformdemo
GEMINI_API_KEY=your_gemini_key
CLIENT_ORIGIN=http://localhost:3000
GCS_BUCKET_NAME=your_bucket_name
GCP_PROJECT_ID=...
GCP_SERVICE_ACCOUNT_EMAIL=...
GCP_PRIVATE_KEY_ID=...
GCP_CLIENT_ID=...
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**`client/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Run

```bash
# apply migrations to your database
cd server && npx prisma migrate deploy && cd ..

# start the backend
npm run dev:server

# in a separate terminal, start the frontend
npm run dev:client
```

Open `http://localhost:3000`, drop a video in, and watch the analysis stream.

### Deploy

The repo ships with deploy paths for two free tiers:

- **Frontend → Vercel** — connect the repo, set root to `client/`, override the install command to `cd .. && npm install`
- **Backend → Render** — connect the repo, build command `npm install && cd server && npx prisma migrate deploy`, start command `npm run start --workspace=server`
- **Database → Render Postgres or Neon** — both work, both free tiers are sufficient for the demo

Full deploy walkthroughs in [docs/deploy.md](docs/deploy.md) (coming soon).

---

## Contributing

PRs and issues welcome — especially around:

- **Prompt improvements** — the prompt in [server/lib/analyzevideo.ts](server/lib/analyzevideo.ts) is the surface most worth iterating on. If you find prompts that produce better classifications, send them.
- **New creative categories** — the 13 categories aren't sacred. If your team uses a different framework that produces better signal, we want to see it.
- **Platform integrations** — Meta Ads, TikTok Ads, YouTube — anything that lets the predicted performance be checked against the real thing.
- **UI/UX** — design system is in `nfds/`, the existing pass is by no means done.

Process:

1. Fork
2. Branch off `main`
3. Open a PR with a clear description of what changed and why
4. CI must be green

For larger changes (new analysis dimensions, new integrations) open an issue first so we can align on direction.

---

## License

MIT. See [LICENSE](LICENSE).

Use it. Fork it. Ship something better. Tell us what you found.

---

Built independently. Open-sourced with support from [NewForm](https://newform.ai) — the data-driven creative company.
