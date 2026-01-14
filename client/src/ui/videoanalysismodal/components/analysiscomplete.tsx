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
  reset,
}: {
  video: VideoAdInterface;
  reset?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [keyMomentsIndex, setKeyMomentsIndex] = useState<number>(0);
  return (
    <div className="w-full h-11/12 flex justify-start items-center px-6 py-2">
      <div className="h-12/12 aspect-9/16 flex flex-col justify-between items-center">
        <Video
          videoRef={videoRef}
          video={video}
          setKeyMomentsIndex={setKeyMomentsIndex}
        />
        <div className="w-full px-5 flex justify-between items-center">
          <Button variant="secondary" className="w-auto">
            Close
          </Button>
          <Button onClick={reset} className="w-auto">
            Analyze Another
          </Button>
        </div>
      </div>
      <div
        className="flex flex-1 h-full flex-col justify-start items-center pl-12 py-6 overflow-y-scroll no-scroll"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <Subtitle className="self-start mb-2">{video.title}</Subtitle>
        <Description className="self-start mb-8">
          {video.description}
        </Description>
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
          <Description className="px-2">
            {video.platformFit.reasoning}
          </Description>
        </SectionContainer>
        <SectionContainer>
          {video.vibes.map((vibe, index) => (
            <LevelCard
              title={`${getVibeEmoji(vibe.vibe)}${vibe.vibe}`}
              value={`${vibe.rate}/10`}
              percentage={(100 / 10) * vibe.rate}
            />
          ))}
        </SectionContainer>
        <SectionContainer>
          <LevelCard title="Age range" value={video.demographics.ageRange} />
          <LevelCard title="Gender" value={video.demographics.gender} />
        </SectionContainer>
        <SectionContainer>
          {video.demographics.interests.map((interest, index) => (
            <span className="px-4 py-1.5 rounded-full bg-primary text-background-mute">
              {interest}
            </span>
          ))}
        </SectionContainer>
        <KeyMoments
          videoRef={videoRef}
          keyMomentsIndex={keyMomentsIndex}
          keyMoments={video.keyMoments}
          setKeyMomentsIndex={setKeyMomentsIndex}
        />
        <div className="w-full flex flex-col justify-start items-start">
          {video.suggestions.map((suggestion) => (
            <Suggestion key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
}

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
        className
      )}
    >
      {children}
    </div>
  );
}

export default AnalysisComplete;
