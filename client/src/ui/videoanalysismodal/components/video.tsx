import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

function Video({
  video,
  videoRef,
  setKeyMomentsIndex,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  video: VideoAdInterface;
  setKeyMomentsIndex: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="h-11/12 aspect-9/16 rounded-3xl relative">
      <div className="rounded-3xl w-full h-full bg-primary-dark -translate-x-3.5 -translate-y-3.5" />
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0! rounded-3xl"
        src={`http://localhost:4000/uploads/videos/${video.uniqueName}`}
        controls={false}
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget;
          const { keyMoments } = video;
          if (currentTime === 0) {
            setKeyMomentsIndex(-1);
            return;
          }
          for (let i = 0; i < keyMoments.length; i++) {
            const moment = keyMoments[i];
            const time = currentTime - 0.5;
            const next =
              i === keyMoments.length - 1
                ? duration + 10
                : keyMoments[i + 1].timestamp - 0.7;
            if (time >= moment.timestamp && time < next) {
              setKeyMomentsIndex(i);
              break;
            }
          }
        }}
        loop
        autoPlay
      />
    </div>
  );
}

export default Video;
