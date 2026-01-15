import { useAppFlow } from "@/providers/appflow";
import Button from "@/ui/button";
import Modal from "@/ui/modal";
import { Description, Label, Subtitle, Title } from "@/ui/text";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import {
  Activity,
  Circle,
  Clock,
  Delete,
  Globe,
  Globe2,
  Key,
  Layers,
  Layers2,
  Trash,
  Video,
  Volume,
  Volume1,
  VolumeX,
  Zap,
} from "lucide-react";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface VideoAdInterface {
  recentlyAdded?: boolean;
  id: number;
  uri: string;
  originalName: string;
  uniqueName: string;
  title: string;
  description: string;
  mimetype: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  hook: {
    id: number;
    hookStrength: number;
    reason: string;
    description: string;
    videoId: number;
  };
  demographics: {
    id: number;
    ageRange: string;
    gender: string;
    interests: string[];
    videoId: number;
  };
  performance: {
    id: number;
    estimatedCTR: number;
    engagementRate: number;
    viralityScore: number;
    confidence: string;
    reasoning: string;
    videoId: number;
  };
  ctaAnalysis: null;
  technicalQuality: null;
  vibes: {
    id: number;
    vibe: string;
    rate: number;
    videoId: number;
  }[];
  keyMoments: {
    id: number;
    timestamp: number;
    reason: string;
    videoId: number;
  }[];
  suggestions: {
    id: number;
    recommendation: string;
    reason: string;
    priority: string;
    videoId: number;
  }[];
  platformFit: {
    id: number;
    bestPlatform: string;
    tiktokScore: number;
    reelsScore: number;
    shortsScore: number;
    reasoning: string;
    videoId: number;
  };
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="w-1/4">{children}</div>;
}

function AdVideoItem({ video }: { video: VideoAdInterface }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstRender = useRef<boolean>(false);
  const [animateRecentlyAdded, setAnimateRecentlyAdded] =
    useState<boolean>(false);
  const [keyMomentsIndex, setKeyMomentsIndex] = useState<number>(-1);

  useEffect(() => {
    if (!video.recentlyAdded) return;
    if (video.recentlyAdded) setAnimateRecentlyAdded(true);
    const timer = setTimeout(() => {
      if (video.recentlyAdded) {
        setAnimateRecentlyAdded(false);
        clearTimeout(timer);
      }
    }, 30000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Container>
      <div
        className={clsx(
          "w-[93%] aspect-9/16 flex flex-col justify-start items-center relative"
        )}
      >
        {animateRecentlyAdded ? (
          <div className="absolute top-0 left-0 scale-y-[1.06] scale-x-[1.09]! w-full h-full z-0 rounded-3xl bg-primary/50 animate-pulse" />
        ) : null}
        <div
          className="w-full h-full rounded-3xl mx-2 mt-8 bg-amber-200 relative group"
          onMouseEnter={() => {
            if (!firstRender.current && videoRef.current) {
              videoRef.current.muted = true;
              firstRender.current = true;
            }
            if (videoRef.current && !videoRef.current.paused) return;
            videoRef.current?.play();
          }}
          onMouseLeave={() => {
            setKeyMomentsIndex(-1);
            videoRef.current?.pause();
            if (videoRef.current) videoRef.current.currentTime = 0;
          }}
        >
          <div className="z-999 absolute top-0 left-0 w-full h-full rounded-3xl bg-black/10 opacity-0 group-hover:opacity-100 duration-300 ease-out transition-all">
            <VideoTopBar
              estimatedCTR={video.performance.estimatedCTR}
              engagementRate={video.performance.engagementRate}
              viralityScore={video.performance.viralityScore}
            />
            <VideoBottom
              id={video.id}
              videoRef={videoRef}
              createdAt={video.createdAt}
            />
            <KeyMomentsDescription
              reason={
                keyMomentsIndex < 0
                  ? null
                  : video.keyMoments[keyMomentsIndex].reason
              }
            />
          </div>
          <div
            className={
              "z-50 absolute top-0 left-0 w-full h-full rounded-3xl bg-black/40 group-hover:opacity-0 duration-300 ease-out transition-all opacity-100 group-hover:pointer-events-none"
            }
          >
            <HookStrength strength={video.hook.hookStrength} />
            <BestPlatform platform={video.platformFit.bestPlatform} />
            <Duration duration={"0:15"} />
            <KeyMoments keyMoments={video.keyMoments.length} />
          </div>
          <div className="absolute top-0 left-0 w-full h-full rounded-3xl z-0">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover z-0! rounded-3xl"
              src={`http://localhost:4000/uploads/videos/${video.uniqueName}`}
              controls={false}
              onTimeUpdate={(e) => {
                const { currentTime, duration } = e.currentTarget;
                const { keyMoments } = video;
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
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-3xl" />
          </div>
        </div>
        <div
          className={clsx(
            "w-full px-2 pt-2 flex flex-col relative group-hover:opacity-0 duration-300",
            keyMomentsIndex !== -1 && "opacity-0"
          )}
        >
          <span className="text-text font-bold line-clamp-2">
            {video.title}
          </span>
        </div>
      </div>
    </Container>
  );
}

function KeyMomentsDescription({ reason: _reason }: { reason: string | null }) {
  const [reason, setReason] = useState<string | null>(_reason);
  const [reanimate, setReanimate] = useState<boolean>(false);
  useEffect(() => {
    if (_reason === null) return;
    setReanimate(true);
    setTimeout(() => {
      setReanimate(false);
      setReason(_reason);
    }, 200);
  }, [_reason]);
  return (
    <span
      className={`duration-500 transition-all ease-in-out absolute bottom-0 right-0 p-4 w-full rounded-lg bg-background-soft border-b-4 text-base font-semibold text-text flex justify-center items-center ${
        reason === null
          ? "opacity-0 pointer-events-none"
          : "opacity-100 translate-y-full pointer-events-none"
      }`}
    >
      <span
        className={`transition-all duration-200 ease-in-out ${
          reanimate ? "opacity-0" : "opacity-100"
        }`}
      >
        {reason}
      </span>
    </span>
  );
}
function BestPlatform({ platform }: { platform: string }) {
  return (
    <span
      className={`absolute top-0 right-0 -translate-y-0.5 translate-x-0.5 h-9 px-4 rounded-lg bg-background-soft border-b-4 text-base font-semibold text-text flex justify-center items-center`}
    >
      <span>{platform}</span>
      <Globe2 className="ml-0.5" size={18} />
    </span>
  );
}

function KeyMoments({ keyMoments }: { keyMoments: number }) {
  return (
    <span
      className={`absolute bottom-0 right-0 translate-y-0.5 translate-x-0.5 h-9 px-4 rounded-lg bg-background-soft border-b-4 text-base font-semibold text-text flex justify-center items-center`}
    >
      <span className="text-lg">{keyMoments}</span>
      <Clock className="ml-0.5" size={18} />
    </span>
  );
}

function Duration({ duration }: { duration: string }) {
  return (
    <span
      className={`absolute bottom-1.5 left-0 h-9 px-4 rounded-lg text-lg font-semibold text-background-mute flex justify-center items-center`}
    >
      {duration}
    </span>
  );
}

function VideoBottom({
  createdAt,
  videoRef,
  id,
}: {
  id: number;
  createdAt: string;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const [muted, setMuted] = useState<boolean>(true);

  const date = useMemo(() => {
    const _date = new Date(createdAt);
    return _date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [createdAt]);
  const { addToast } = useAppFlow();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const utils = trpc.useContext();

  const deleteVideo = trpc.video.delete.useMutation({
    onSuccess: () => {
      utils.video.searchAndFilter.invalidate();
      addToast({
        type: "success",
        message: "The ad was deleted successfuly",
        duration: 4000,
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: "Unable to delete toast",
        duration: 4000,
      });
    },
  });

  const handleDelete = () => {
    deleteVideo.mutate({ id });
  };

  useEffect(() => {
    if (!openModal) return;
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }, [openModal]);

  return (
    <div className="absolute bottom-0 left-0 w-full px-4 py-1.5 flex justify-between items-end">
      <span className="text-background-mute">{date}</span>
      <div className="flex flex-col justify-center items-center mb-1.5">
        <button
          className={clsx(
            "text-background-mute cursor-pointer mb-2",
            muted ? "translate-x-0" : "translate-x-1"
          )}
          onClick={() => {
            if (!videoRef.current) return;
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
          }}
        >
          {muted ? <VolumeX /> : <Volume1 />}
        </button>
        <Modal
          title="Edit Profile"
          description="Make changes to your profile here. Click save when you're done."
          className="w-auto! px-20 h-auto! pt-16 pb-8 rounded-2xl! border-2 border-b-8 border-primary"
          classNameContainer="flex! flex-col! justify-center! items-start!"
          trigger={
            <button className="text-error/80 cursor-pointer">
              <Trash size={22} />
            </button>
          }
          open={openModal}
          onOpenChange={setOpenModal}
        >
          <Subtitle className="mb-2">
            Are you sure you want to delete this add?
          </Subtitle>
          <Label className="mb-5">This action can't be reverted.</Label>
          <div className="w-full flex justify-end items-end mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                setOpenModal(false);
              }}
              className="mr-2"
            >
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function VideoTopBar({
  estimatedCTR,
  engagementRate,
  viralityScore,
}: {
  estimatedCTR: number;
  engagementRate: number;
  viralityScore: number;
}) {
  const Item = useCallback(
    ({ title, value }: { title: string; value: string | number }) => {
      return (
        <div className="w-1/3 h-full flex flex-col justify-center items-center text-text py-1">
          <span className="text-center text-xs tracking-widest">{title}</span>
          <span className="text-center text-base">{value}</span>
        </div>
      );
    },
    []
  );
  return (
    <div className="absolute top-0 left-0 w-full flex justify-center items-center pt-3.5">
      <div
        className={`w-8/12 rounded-xl text-lg font-semibold bg-background-mute flex justify-center items-center overflow-hidden`}
      >
        <Item title="CTR" value={`${estimatedCTR}%`} />
        <Item title="Engage" value={`${engagementRate}%`} />
        <Item title="Viral" value={`${viralityScore}/10`} />
      </div>
    </div>
  );
}

function HookStrength({ strength }: { strength: number | string }) {
  const borderColor = useMemo(() => {
    const strn = Number(strength);
    if (strn <= 10 && strn >= 7) {
      return "border-primary";
    } else if (strn <= 6 && strn >= 4) {
      return "border-warning";
    } else {
      return "border-error";
    }
  }, [strength]);
  const textColor = useMemo(() => {
    const strn = Number(strength);
    if (strn <= 10 && strn >= 7) {
      return "text-primary";
    } else if (strn <= 6 && strn >= 4) {
      return "text-warning";
    } else {
      return "text-error";
    }
  }, [strength]);
  return (
    <span
      className={`absolute top-0 left-0 -translate-y-0.5 -translate-x-0.5 px-4 h-9 rounded-lg bg-background-soft border-b-4 text-lg font-bold ${borderColor} ${textColor} flex justify-center items-center`}
    >
      <span>{strength}</span>
      <Zap className="ml-0.5" size={18} />
    </span>
  );
}

export default AdVideoItem;
