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
      className={`duration-500 transition-all ease-in-out p-4 w-[100%] text-base font-semibold text-text flex justify-start items-center cursor-pointer mb-4 ${
        active ? "scale-100" : "opacity-60"
      } hover:opacity-85 active:scale-95`}
    >
      <span>
        {reason} [{formatSecondsToMMSS(time)}]
      </span>
    </NewFormCard>
  );
}

export default KeyMomentsContainer;
