import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import Button from "@/ui/button";
import NewFormCard from "@/ui/newformcard";
import clsx from "clsx";
import { Eye, EyeClosed, Volume1, Volume2, VolumeX } from "lucide-react";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

function Video({
  video,
  videoRef,
  keyMomentsIndex,
  setKeyMomentsIndex,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  keyMomentsIndex: number;
  video: VideoAdInterface;
  setKeyMomentsIndex: Dispatch<SetStateAction<number>>;
}) {
  const [muted, setMuted] = useState<boolean>(false);
  const [hideKeyMoments, setHideKeyMoments] = useState<boolean>(true);
  const [percentage, setPercentage] = useState<number>(0);
  const [duration, setDuration] = useState<number>(-1);
  const progressBarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-11/12 aspect-9/16 rounded-3xl relative group">
      <div className="rounded-3xl w-full h-full bg-primary-dark -translate-x-3.5 -translate-y-3.5" />
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-10! rounded-3xl"
        src={`http://localhost:4000/uploads/videos/${video.uniqueName}`}
        controls={false}
        onTimeUpdate={(e) => {
          const { currentTime, duration: _duration } = e.currentTarget;
          if (duration < 0) setDuration(_duration);
          setPercentage((100 / _duration) * currentTime);
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
                ? _duration + 10
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
      <div
        onClick={() => {
          if (!videoRef.current) return;
          const paused = videoRef.current.paused;
          if (paused) {
            videoRef.current.play();
            return;
          }
          videoRef.current.pause();
        }}
        className="transition-all duration-300 ease-out absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 group-hover:opacity-100 rounded-3xl flex flex-col justify-between items-center z-20"
      >
        <div className="w-full flex justify-between items-center py-6 px-4">
          <button
            className={clsx(
              "text-background-mute cursor-pointer",
              muted ? "translate-x-0" : "translate-x-0"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!videoRef.current) return;
              videoRef.current.muted = !videoRef.current.muted;
              setMuted(videoRef.current.muted);
            }}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <button
            className={clsx(
              "text-background-mute cursor-pointer",
              muted ? "translate-x-0" : "translate-x-0"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setHideKeyMoments((prev) => !prev);
            }}
          >
            {hideKeyMoments ? <EyeClosed /> : <Eye />}
          </button>
        </div>
        <div className="w-full py-6 flex justify-center items-center">
          <div
            ref={progressBarRef}
            onClick={(e) => {
              e.stopPropagation();
              if (duration < 0 || !videoRef.current || !progressBarRef.current)
                return;

              const rect = progressBarRef.current.getBoundingClientRect();
              const clickX = e.clientX - rect.left; // Click position relative to the element
              const width = rect.width;
              const percentage = clickX / width; // 0 to 1
              const time = duration * percentage;

              videoRef.current.currentTime = time;
            }}
            className="w-10/12 h-2 bg-text-muted/70 rounded-full pointer-events-auto flex justify-start items-center cursor-pointer relative"
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
            <VideoProgressKeyMoments
              keyMoments={video.keyMoments}
              videoRef={videoRef}
              duration={duration}
              setKeyMomentsIndex={setKeyMomentsIndex}
            />
          </div>
        </div>
      </div>
      <KeyMomentsSidebar
        keyMoments={video.keyMoments}
        duration={duration}
        videoRef={videoRef}
        setKeyMomentsIndex={setKeyMomentsIndex}
        keyMomentsIndex={keyMomentsIndex}
        hide={hideKeyMoments}
      />
    </div>
  );
}

function KeyMomentsSidebar({
  keyMoments,
  duration,
  hide,
  videoRef,
  keyMomentsIndex,
  setKeyMomentsIndex,
}: {
  keyMoments: VideoAdInterface["keyMoments"];
  duration: number;
  hide: boolean;
  keyMomentsIndex: number;
  videoRef: RefObject<HTMLVideoElement | null>;
  setKeyMomentsIndex: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div
      className={clsx(
        "absolute top-0 right-0 translate-x-full w-9 h-full flex justify-start items-center py-4 pointer-events-none z-0!",
        hide && "hidden"
      )}
    >
      <div className="w-full h-full flex flex-col justify-between">
        {keyMoments.map((moment, index) => {
          return (
            <div className="w-125 h-auto pointer-events-none flex justify-start items-center">
              <button
                key={index}
                className={clsx(
                  "w-5 h-full bg-primary/70 -translate-x-2 hover:bg-primary hover:scale-105 hover:rounded-r-xl duration-200 ease-in-out transition-all rounded-r-lg cursor-pointer pointer-events-auto",
                  index === keyMomentsIndex && "bg-primary!"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!videoRef.current) return;
                  setKeyMomentsIndex(index);
                  videoRef.current.currentTime = moment.timestamp;
                }}
              ></button>
              <NewFormCard
                className={`duration-500 transition-all ease-in-out p-4 w-full text-base font-semibold text-text flex justify-center items-center mb-0 cursor-pointer max-w-7/12 ${
                  index === keyMomentsIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
                }`}
              >
                <span>{moment.reason}</span>
              </NewFormCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoProgressKeyMoments({
  keyMoments,
  videoRef,
  duration,
  setKeyMomentsIndex,
}: {
  keyMoments: VideoAdInterface["keyMoments"];
  videoRef: RefObject<HTMLVideoElement | null>;
  duration: number;
  setKeyMomentsIndex: Dispatch<SetStateAction<number>>;
}) {
  return (
    <React.Fragment>
      {keyMoments.map((moment, index) => {
        const position = (100 / duration) * moment.timestamp;
        return (
          <button
            key={index}
            className="absolute top-0 left-0 h-full bg-background-soft/70 hover:background-soft hover:scale-125 duration-200 ease-in-out transition-all aspect-square! rounded-full cursor-pointer"
            style={{ left: position + "%" }}
            onClick={(e) => {
              e.stopPropagation();
              if (!videoRef.current) return;
              setKeyMomentsIndex(index);
              videoRef.current.currentTime = moment.timestamp;
            }}
          ></button>
        );
      })}
    </React.Fragment>
  );
}

export default Video;
