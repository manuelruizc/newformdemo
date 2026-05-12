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
    <div className="h-11/12 aspect-9/16 rounded-2xl relative group mt-2 overflow-visible">
      <div className="rounded-2xl w-full h-full bg-background-mute" />
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-10! rounded-2xl"
        src={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/uploads/videos/${video.uniqueName}`}
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
        className="transition-opacity duration-200 ease-out absolute top-0 left-0 w-full h-full bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col justify-between items-center z-20"
      >
        <div className="w-full flex justify-between items-center py-4 px-4">
          <button
            className="text-white/80 hover:text-white cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (!videoRef.current) return;
              videoRef.current.muted = !videoRef.current.muted;
              setMuted(videoRef.current.muted);
            }}
          >
            {muted ? <VolumeX strokeWidth={1.5} size={18} /> : <Volume2 strokeWidth={1.5} size={18} />}
          </button>
          <button
            className="text-white/80 hover:text-white cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setHideKeyMoments((prev) => !prev);
            }}
          >
            {hideKeyMoments ? <EyeClosed strokeWidth={1.5} size={18} /> : <Eye strokeWidth={1.5} size={18} />}
          </button>
        </div>
        <div className="w-full py-4 mb-4 flex justify-center items-center">
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
            className="w-10/12 h-1 bg-white/30 rounded-full pointer-events-auto flex justify-start items-center cursor-pointer relative"
          >
            <div
              className="h-full bg-white rounded-full"
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
        "flex absolute left-0 bottom-0 lg:top-0! lg:right-0! lg:translate-x-full w-full h-full justify-start items-center py-4 pointer-events-none lg:z-0! z-9999!",
        hide && "flex lg:hidden",
      )}
    >
      <div className="w-full h-full flex flex-col lg:justify-between justify-end">
        {keyMoments.map((moment, index) => {
          return (
            <div className="w-full lg:w-125 pointer-events-none flex justify-start items-center h-full">
              <button
                key={index}
                className={clsx(
                  "hidden lg:flex w-1 h-full bg-primary/50 hover:bg-primary duration-200 ease-out transition-colors rounded-r cursor-pointer pointer-events-auto",
                  index === keyMomentsIndex && "bg-primary! w-1.5!",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!videoRef.current) return;
                  setKeyMomentsIndex(index);
                  videoRef.current.currentTime = moment.timestamp;
                }}
              ></button>
              <NewFormCard
                className={`absolute lg:relative bottom-0 left-0 duration-200 transition-all ease-out p-4 w-full text-sm text-text flex justify-center items-center mb-0 cursor-pointer lg:max-w-7/12 ml-3 ${
                  index === keyMomentsIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 pointer-events-none"
                }`}
              >
                <span className="text-xs md:text-sm leading-snug">{moment.reason}</span>
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
            className="absolute top-1/2 -translate-y-1/2 h-2 w-2 bg-white hover:bg-primary duration-200 ease-out transition-colors rounded-full cursor-pointer"
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
