import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import Video from "./video";
import KeyMoments from "./keymoments";
import { useRef, useState } from "react";
import { Description, Subtitle } from "@/ui/text";
import LevelCard from "@/ui/levelcard";
import clsx from "clsx";
import NewFormCard from "@/ui/newformcard";
import Button from "@/ui/button";

function capitalizeVibe(vibe: string): string {
  if (!vibe) return vibe;
  return vibe.charAt(0).toUpperCase() + vibe.slice(1).toLowerCase();
}

function AnalysisComplete({
  video,
  className,
  reset,
}: {
  video: VideoAdInterface;
  reset?: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [keyMomentsIndex, setKeyMomentsIndex] = useState<number>(0);
  return (
    <div
      className={clsx(
        "w-full h-11/12 flex flex-col lg:flex-row justify-start items-center px-6 py-2 overflow-y-scroll",
        className,
      )}
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <div
        className={clsx(
          "w-10/12 sm:w-6/12 lg:h-12/12 lg:w-auto mt-0 aspect-9/16 flex flex-col justify-between items-center",
          reset && "mb-8 lg:mb-0",
        )}
      >
        <Video
          videoRef={videoRef}
          video={video}
          setKeyMomentsIndex={setKeyMomentsIndex}
          keyMomentsIndex={keyMomentsIndex}
        />
        {reset ? (
          <div className="w-full px-5 flex justify-between items-center gap-3">
            <Button variant="secondary" className="w-auto">
              Close
            </Button>

            <Button onClick={reset} className="w-auto">
              Analyze another
            </Button>
          </div>
        ) : null}
      </div>
      <div
        className="flex flex-1 h-full flex-col justify-start items-center w-full max-w-full lg:w-auto pl-12 py-6 pt-0! lg:py-6 lg:overflow-y-scroll no-scroll"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <span className="font-newform-mono! text-[11px] uppercase tracking-[0.18em] text-text-secondary self-start mb-2">
          Ad
        </span>
        <Subtitle className="self-start">{video.title}</Subtitle>
        <Description className="self-start mt-2">{video.description}</Description>
        <SectionHeader>
          <SectionSubtitle>Creative performance</SectionSubtitle>
          <SectionDescription>
            AI-driven forecasting of the creative's overall market viability,
            analyzing projected performance across attention retention,
            conversion probability, and organic growth potential.
          </SectionDescription>
        </SectionHeader>
        <SectionContainer>
          <LevelCard
            title="Hook"
            value={`${video.hook.hookStrength}/10`}
            percentage={(100 / 10) * video.hook.hookStrength}
          />
          <LevelCard
            title="CTR est"
            value={`${video.performance.estimatedCTR}%`}
            percentage={video.performance.estimatedCTR}
          />
          <LevelCard
            title="Virality"
            value={`${video.performance.viralityScore}/10`}
            percentage={(100 / 10) * video.performance.viralityScore}
          />
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Platform resonance</SectionSubtitle>
          <SectionDescription>
            A predictive breakdown of "thumb-stop" efficiency per channel,
            analyzing how effectively the opening sequence is expected to engage
            users within specific platform ecosystems.
          </SectionDescription>
        </SectionHeader>
        <SectionContainer>
          <LevelCard
            title="TikTok"
            value={`${video.platformFit.tiktokScore}/10`}
            percentage={(100 / 10) * video.platformFit.tiktokScore}
          />
          <LevelCard
            title="Reels"
            value={`${video.platformFit.reelsScore}/10`}
            percentage={(100 / 10) * video.platformFit.reelsScore}
          />
          <LevelCard
            title="YT Shorts"
            value={`${video.platformFit.shortsScore}/10`}
            percentage={(100 / 10) * video.platformFit.shortsScore}
          />
        </SectionContainer>
        <SectionContainer>
          <Description>{video.platformFit.reasoning}</Description>
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Aesthetic & emotional profile</SectionSubtitle>
          <SectionDescription>
            A predictive analysis of the video’s sensory appeal, identifying the
            emotional tone, visual energy, and cultural pacing to ensure the
            creative alignment matches the intended brand atmosphere.
          </SectionDescription>
        </SectionHeader>
        <SectionContainer>
          {video.vibes.map((vibe) => (
            <LevelCard
              key={vibe.id}
              title={capitalizeVibe(vibe.vibe)}
              value={`${vibe.rate}/10`}
              percentage={(100 / 10) * vibe.rate}
            />
          ))}
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Predicted audience reach</SectionSubtitle>
          <SectionDescription>
            An AI-forecasted breakdown of the high-resonance viewer profile,
            identifying the specific age groups, gender leanings, and niche
            interests most likely to engage with this content.
          </SectionDescription>
        </SectionHeader>
        <SectionContainer>
          <LevelCard title="Age range" value={video.demographics.ageRange} />
          <LevelCard title="Gender" value={video.demographics.gender} />
        </SectionContainer>
        <div className="self-start mb-3 mt-2">
          <span className="font-newform-mono! text-[11px] uppercase tracking-[0.18em] text-text-secondary">
            Demographic interests
          </span>
        </div>
        <SectionContainer className="justify-start flex-wrap gap-2">
          {video.demographics.interests.map((interest, index) => (
            <span
              key={`${interest}-${index}`}
              className="px-3 py-1 rounded-md bg-background-mute text-text border border-border text-xs"
            >
              {interest}
            </span>
          ))}
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Key engagement milestones</SectionSubtitle>
          <SectionDescription>
            Predictive analysis of specific timestamps where viewer retention
            and emotional resonance are at their peak. These highlights identify
            the core visual and narrative triggers—such as product reveals or
            high-energy transitions—that are forecasted to drive the highest
            interaction rates.
          </SectionDescription>
        </SectionHeader>
        <KeyMoments
          videoRef={videoRef}
          keyMomentsIndex={keyMomentsIndex}
          keyMoments={video.keyMoments}
          setKeyMomentsIndex={setKeyMomentsIndex}
        />
        <SectionHeader>
          <SectionSubtitle>Optimization roadmap</SectionSubtitle>
          <SectionDescription>
            Actionable, AI-generated refinements designed to bridge the gap
            between current performance and peak creative potential. This
            analysis identifies specific technical and narrative
            adjustments—ranging from clip sequencing to audio
            synchronization—aimed at maximizing retention and conversion rates
            across all targeted platforms.
          </SectionDescription>
        </SectionHeader>
        <div className="w-full flex flex-col justify-start items-start">
          {video.suggestions.map((suggestion) => (
            <Suggestion key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
  <span className="font-newform-mono! text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-2">
    {children}
  </span>
);
const SectionDescription = ({ children }: { children: React.ReactNode }) => (
  <Description>{children}</Description>
);
const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-start items-start w-full mb-5 mt-8">
      {children}
    </div>
  );
};

function Suggestion({
  suggestion,
}: {
  suggestion: VideoAdInterface["suggestions"][number];
}) {
  return (
    <NewFormCard className="w-full flex flex-col justify-start items-start mb-3 p-5 gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-newform-mono! text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          Suggestion
        </span>
        <Description>{suggestion.recommendation}</Description>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-newform-mono! text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          Why
        </span>
        <Description>{suggestion.reason}</Description>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-newform-mono! text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          Priority
        </span>
        <Description className="capitalize">{suggestion.priority}</Description>
      </div>
    </NewFormCard>
  );
}

function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "w-full flex justify-between items-start mb-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default AnalysisComplete;
