import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import Video from "./video";
import KeyMoments from "./keymoments";
import { useRef, useState } from "react";
import { Description, Subtitle } from "@/ui/text";
import LevelCard from "@/ui/levelcard";
import clsx from "clsx";
import NewFormCard from "@/ui/newformcard";
import Button from "@/ui/button";

function getVibeEmoji(vibe: string): string {
  vibe = vibe.toLowerCase();
  const emojiMap: Record<string, string> = {
    energetic: "⚡",
    authentic: "✨",
    inspirational: "💪",
    helpful: "🙏",
    playful: "🎉",
    professional: "💼",
    emotional: "❤️",
    humorous: "😄",
    mysterious: "🔮",
    calm: "🧘",
    intense: "🔥",
  };
  return emojiMap[vibe.toLowerCase()] || "✨";
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
          <div className="w-full px-5 flex justify-between items-center">
            <Button variant="secondary" className="w-auto">
              Close
            </Button>

            <Button onClick={reset} className="w-auto">
              Analyze Another
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
        <Subtitle className="self-start">{video.title}</Subtitle>
        <Description className="self-start">{video.description}</Description>
        <SectionHeader>
          <SectionSubtitle>Creative Performance</SectionSubtitle>
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
            title="Tik Tok"
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
          <Description className="font-bold! underline">
            {video.platformFit.reasoning}
          </Description>
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Aesthetic & Emotional Profile</SectionSubtitle>
          <SectionDescription>
            A predictive analysis of the video’s sensory appeal, identifying the
            emotional tone, visual energy, and cultural pacing to ensure the
            creative alignment matches the intended brand atmosphere.
          </SectionDescription>
        </SectionHeader>
        <SectionContainer>
          {video.vibes.map((vibe, index) => (
            <LevelCard
              title={`${getVibeEmoji(vibe.vibe)}${vibe.vibe}`}
              value={`${vibe.rate}/10`}
              percentage={(100 / 10) * vibe.rate}
            />
          ))}
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Predicted Audience Reach</SectionSubtitle>
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
        <div className="self-start mb-2">
          <Description className="font-semibold">
            Demographic Interests
          </Description>
        </div>
        <SectionContainer className="justify-start flex-wrap">
          {video.demographics.interests.map((interest, index) => (
            <span className="px-4 py-1.5 mb-1.5 rounded-full bg-background-mute text-primary border border-b-4 border-b-primary mr-2 text-sm lg:text-base">
              {interest}
            </span>
          ))}
        </SectionContainer>
        <SectionHeader>
          <SectionSubtitle>Key Engagement Milestones</SectionSubtitle>
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
          <SectionSubtitle>Optimization Roadmap</SectionSubtitle>
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
  <Subtitle className="uppercase font-bold! tracking-widest!">
    {children}
  </Subtitle>
);
const SectionDescription = ({ children }: { children: React.ReactNode }) => (
  <Description>{children}</Description>
);
const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-start items-start w-full bg-red mb-6 mt-8">
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
    <NewFormCard className="w-full flex flex-col justify-start items-start mb-4 p-4 py-6">
      <Description className="mb-2">
        <b>Suggestion: </b>
        {suggestion.recommendation}
      </Description>
      <Description className="mb-2">
        <b>Why: </b>
        {suggestion.reason}
      </Description>
      <Description>
        <b>Priority: </b>
        {suggestion.priority}
      </Description>
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
