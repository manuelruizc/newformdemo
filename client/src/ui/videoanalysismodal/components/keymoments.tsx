import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import NewFormCard from "@/ui/newformcard";
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
    <div className="w-full flex flex-wrap  justify-between items-center">
      {keyMoments.map((keyMoment, index) => (
        <KeyMoment
          key={keyMoment.id}
          reason={keyMoment.reason}
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
  onClick,
}: {
  reason: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <NewFormCard
      onClick={onClick}
      className={`duration-500 transition-all ease-in-out p-4 w-[45%] text-base font-semibold text-text flex justify-center items-center mb-0 cursor-pointer ${
        active ? "scale-100 opacity-100" : "scale-75 opacity-60"
      } hover:opacity-85 active:scale-95`}
    >
      <span>{reason}</span>
    </NewFormCard>
  );
}

export default KeyMomentsContainer;
