import { useAppFlow } from "@/providers/appflow";
import Button from "@/ui/button";
import Modal from "@/ui/modal";
import { Description, Subtitle } from "@/ui/text";
import AnalysisComplete from "@/ui/videoanalysismodal/components/analysiscomplete";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { Globe2, Sparkles, Volume1, VolumeX, Zap } from "lucide-react";
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

function Container({
  id,
  children,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="w-full max-w-xs">
      {children}
    </div>
  );
}

function AdVideoItem({ video, id }: { id?: string; video: VideoAdInterface }) {
  const [openModal, setOpenModal] = useState<boolean>(false);
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <Container id={id}>
      <div
        className={clsx(
          "w-full aspect-9/16 flex flex-col justify-start items-center relative cursor-pointer",
        )}
        onClick={handleOpenModal}
      >
        {animateRecentlyAdded ? (
          <div className="absolute -inset-1 z-0 rounded-2xl ring-2 ring-primary/40 animate-pulse" />
        ) : null}
        <div
          className="w-full h-full rounded-2xl overflow-hidden bg-background-mute relative group"
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
          <div className="z-999 absolute top-0 left-0 w-full h-full rounded-2xl bg-black/10 opacity-0 group-hover:opacity-100 duration-200 ease-out transition-opacity">
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
              "z-50 absolute top-0 left-0 w-full h-full rounded-2xl bg-linear-to-t from-black/50 via-black/10 to-black/30 group-hover:opacity-0 duration-200 ease-out transition-opacity opacity-100 group-hover:pointer-events-none"
            }
          >
            <HookStrength strength={video.hook.hookStrength} />
            <BestPlatform platform={video.platformFit.bestPlatform} />
            <Duration duration={"0:15"} />
            <KeyMoments keyMoments={video.keyMoments.length} />
          </div>
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl z-0">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover z-0! rounded-2xl"
              src={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/uploads/videos/${video.uniqueName}`}
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
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-2xl" />
          </div>
        </div>
        <div
          className={clsx(
            "w-full px-1 pt-3 flex flex-col relative group-hover:opacity-0 duration-200",
            keyMomentsIndex !== -1 && "opacity-0",
          )}
        >
          <span className="text-sm text-text font-medium line-clamp-2 leading-snug">
            {video.title}
          </span>
        </div>
      </div>
      <Modal
        title=""
        description=""
        open={openModal}
        onOpenChange={setOpenModal}
        classNameContainer="py-6"
      >
        <AnalysisComplete video={video} className="h-full" />
      </Modal>
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
      className={`duration-200 transition-all ease-out absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-background-soft/95 backdrop-blur-sm shadow-md text-sm font-medium text-text flex justify-center items-center ${
        reason === null
          ? "opacity-0 pointer-events-none translate-y-2"
          : "opacity-100 translate-y-0 pointer-events-none"
      }`}
    >
      <span
        className={`transition-opacity duration-200 ${
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
      className="absolute top-3 right-3 h-7 px-2.5 rounded-md bg-background-soft/95 backdrop-blur-sm shadow-xs text-xs font-medium text-text flex justify-center items-center gap-1.5"
    >
      <Globe2 strokeWidth={1.5} size={14} className="text-text-secondary" />
      <span>{platform}</span>
    </span>
  );
}

function KeyMoments({ keyMoments }: { keyMoments: number }) {
  return (
    <span
      className="absolute bottom-3 right-3 h-7 px-2.5 rounded-md bg-background-soft/95 backdrop-blur-sm shadow-xs text-xs font-medium text-text flex justify-center items-center gap-1.5"
    >
      <Sparkles strokeWidth={1.5} size={14} className="text-text-secondary" />
      <span>{keyMoments}</span>
    </span>
  );
}

function Duration({ duration }: { duration: string }) {
  return (
    <span
      className="absolute bottom-3 left-3 h-7 px-2.5 rounded-md bg-black/40 backdrop-blur-sm text-xs font-medium text-white flex justify-center items-center"
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

  const handleDelete = (e: any) => {
    e.stopPropagation();
    deleteVideo.mutate({ id });
  };

  useEffect(() => {
    if (!openModal) return;
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }, [openModal]);

  return (
    <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex justify-between items-end">
      <span className="font-newform-mono! text-[10px] uppercase tracking-[0.18em] text-white/80">
        {date}
      </span>
      <div className="flex flex-col justify-center items-center">
        <button
          className="text-white/80 hover:text-white cursor-pointer transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (!videoRef.current) return;
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
          }}
        >
          {muted ? <VolumeX strokeWidth={1.5} size={18} /> : <Volume1 strokeWidth={1.5} size={18} />}
        </button>
        <Modal
          title=""
          description=""
          className="w-auto! px-12 h-auto! pt-12 pb-8 rounded-2xl! border border-border"
          classNameContainer="flex! flex-col! justify-center! items-start!"
          open={openModal}
          onOpenChange={setOpenModal}
        >
          <Subtitle className="mb-2">
            Are you sure you want to delete this ad?
          </Subtitle>
          <Description className="mb-5">
            This action can't be reverted.
          </Description>
          <div className="w-full flex justify-end items-end mt-6 gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete as () => void}>
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
        <div className="flex-1 flex flex-col justify-center items-center text-text py-2 gap-0.5">
          <span className="font-newform-mono! text-[9px] uppercase tracking-[0.18em] text-text-secondary">
            {title}
          </span>
          <span className="text-sm font-medium text-text">{value}</span>
        </div>
      );
    },
    [],
  );
  return (
    <div className="absolute top-3 left-3 right-3 flex justify-center items-center">
      <div className="w-full rounded-lg bg-background-soft/95 backdrop-blur-sm border border-border shadow-xs flex justify-center items-center overflow-hidden divide-x divide-border">
        <Item title="CTR" value={`${estimatedCTR}%`} />
        <Item title="Engage" value={`${engagementRate}%`} />
        <Item title="Viral" value={`${viralityScore}/10`} />
      </div>
    </div>
  );
}

function HookStrength({ strength }: { strength: number | string }) {
  const accentColor = useMemo(() => {
    const strn = Number(strength);
    if (strn <= 10 && strn >= 7) return "text-primary";
    if (strn <= 6 && strn >= 4) return "text-warning";
    return "text-error";
  }, [strength]);
  return (
    <span className="absolute top-3 left-3 h-7 px-2.5 rounded-md bg-background-soft/95 backdrop-blur-sm shadow-xs text-xs font-medium flex justify-center items-center gap-1.5">
      <Zap strokeWidth={1.5} size={14} className={accentColor} />
      <span className={accentColor}>{strength}</span>
    </span>
  );
}

export default AdVideoItem;
