-- CreateTable
CREATE TABLE "Hook" (
    "id" SERIAL NOT NULL,
    "hookStrength" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "Hook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demographic" (
    "id" SERIAL NOT NULL,
    "ageRange" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "interests" TEXT[],
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "Demographic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformancePrediction" (
    "id" SERIAL NOT NULL,
    "estimatedCTR" DOUBLE PRECISION NOT NULL,
    "engagementRate" DOUBLE PRECISION NOT NULL,
    "viralityScore" INTEGER NOT NULL,
    "confidence" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "PerformancePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtaAnalysis" (
    "id" SERIAL NOT NULL,
    "ctaPresent" BOOLEAN NOT NULL,
    "ctaTimestamp" DOUBLE PRECISION,
    "ctaClarity" INTEGER NOT NULL,
    "ctaType" TEXT NOT NULL,
    "ctaTiming" TEXT NOT NULL,
    "ctaEffectiveness" TEXT NOT NULL,
    "improvement" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "CtaAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalQuality" (
    "id" SERIAL NOT NULL,
    "videoResolution" TEXT NOT NULL,
    "lightingQuality" INTEGER NOT NULL,
    "audioClarity" INTEGER NOT NULL,
    "editingProfessionalism" INTEGER NOT NULL,
    "mobileOptimized" BOOLEAN NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "TechnicalQuality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vibe" (
    "id" SERIAL NOT NULL,
    "vibe" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "Vibe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyMoment" (
    "id" SERIAL NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "KeyMoment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" SERIAL NOT NULL,
    "recommendation" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformFit" (
    "id" SERIAL NOT NULL,
    "bestPlatform" TEXT NOT NULL,
    "tiktokScore" INTEGER NOT NULL,
    "reelsScore" INTEGER NOT NULL,
    "shortsScore" INTEGER NOT NULL,
    "reasoning" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "PlatformFit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hook_videoId_key" ON "Hook"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Demographic_videoId_key" ON "Demographic"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformancePrediction_videoId_key" ON "PerformancePrediction"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "CtaAnalysis_videoId_key" ON "CtaAnalysis"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalQuality_videoId_key" ON "TechnicalQuality"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformFit_videoId_key" ON "PlatformFit"("videoId");

-- AddForeignKey
ALTER TABLE "Hook" ADD CONSTRAINT "Hook_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demographic" ADD CONSTRAINT "Demographic_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePrediction" ADD CONSTRAINT "PerformancePrediction_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtaAnalysis" ADD CONSTRAINT "CtaAnalysis_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalQuality" ADD CONSTRAINT "TechnicalQuality_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vibe" ADD CONSTRAINT "Vibe_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyMoment" ADD CONSTRAINT "KeyMoment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformFit" ADD CONSTRAINT "PlatformFit_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
