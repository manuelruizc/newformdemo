import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import NewFormCard from "@/ui/newformcard";
import { formatSecondsToMMSS } from "@/utils/timeformat";
import { Dispatch, RefObject, SetStateAction } from "react";

function KeyMomentsContainer({
  keyMoments,
  videoRef,
  keyMomentsIndex,
  setKeyMomentsIndex,
}: {
  keyMoments: VideoAdInterface["keyMoments"];
  setKeyMomentsIndex: Dispatch<SetStateAction<number>>;
  videoRef: RefObject<HTMLVideoElement | null>;
  keyMomentsIndex: number;
}) {
  return (
    <div className="w-full flex flex-col justify-between items-start">
      {keyMoments.map((keyMoment, index) => (
        <KeyMoment
          key={keyMoment.id}
          reason={keyMoment.reason}
          time={keyMoment.timestamp}
          active={index === keyMomentsIndex}
          onClick={() => {
            if (!videoRef.current) return;
            videoRef.current.currentTime = keyMoment.timestamp;
            setKeyMomentsIndex(index);
          }}
        />
      ))}
    </div>
  );
}

function KeyMoment({
  reason,
  active,
  time,
  onClick,
}: {
  reason: string;
  active: boolean;
  time: number;
  onClick: () => void;
}) {
  return (
    <NewFormCard
      onClick={onClick}
      className={`duration-200 transition-colors ease-out p-4 w-full text-sm text-text flex justify-start items-center cursor-pointer mb-3 gap-3 hover:bg-background-mute ${
        active ? "ring-2 ring-primary/30 border-primary/40" : ""
      }`}
    >
      <span className="font-newform-mono! text-[10px] tracking-[0.18em] text-text-secondary shrink-0">
        {formatSecondsToMMSS(time)}
      </span>
      <span className="text-text leading-snug">{reason}</span>
    </NewFormCard>
  );
}

export default KeyMomentsContainer;
