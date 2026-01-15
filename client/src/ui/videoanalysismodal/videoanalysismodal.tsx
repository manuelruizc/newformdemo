"use client";
import { streamVideoAnalysis } from "@/app/dashboard/video-analysis/utils/video_analysis";
import FileDragAndDrop from "@/ui/dragandrop";
import LLMTextResponseRenderer from "@/ui/llmtextresponserenderer";
import { Subtitle, Title } from "@/ui/text";
import { trpc } from "@/utils/trpc";
import { useEffect, useMemo, useRef, useState } from "react";
import AnalysisComplete from "./components/analysiscomplete";
import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import { useAppFlow } from "@/providers/appflow";

const QUEUE_LIMIT = 1;

interface VideoFileUploadResponse {
  success: boolean;
  error: string | undefined;
  data: {
    id: number;
    uniqueName: string;
    originalName: string;
    size: number;
    mimetype: string;
    path: string;
  };
}
interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

function VideoAnalysisModal() {
  const { updateAdCreated, addToast } = useAppFlow();
  const [video, setVideo] = useState<VideoAdInterface | null>(null);
  const filesRef = useRef<UploadedFile[]>([]);
  const [response, setResponse] = useState<string>("");
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);
  const [processing, setProcessing] = useState<UploadedFile | null>(null);
  const processingRef = useRef<UploadedFile | null>(null);
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const videoId = useRef<number>(-1);
  const mutation = trpc.video.saveAnalysis.useMutation({
    onSuccess: (data) => {
      setVideo(data as VideoAdInterface);
      setAnalysisCompleted(true);
      updateAdCreated(data as VideoAdInterface);
    },
    onError: (err) => {
      addToast({
        type: "error",
        duration: 6000,
        message:
          "There was an error with the analysis. The analysis is starting again",
      });
      redoAnalysis();
    },
  });

  const deleteVideo = trpc.video.delete.useMutation({
    onSuccess: () => {
      if (!processingRef.current) {
        addToast({
          type: "error",
          duration: 6000,
          message: "Unable to analyze the video in this moment. Try again.",
        });
        return;
      }
      filesRef.current = [processingRef.current];
      setResponse("");
      setProcessing(null);
      setTimeout(() => {
        setProcessing(processingRef.current);
      }, 1000);
    },
    onError: (error) => {
      addToast({
        type: "error",
        duration: 6000,
        message: "Unable to analyze the video in this moment. Try again.",
      });
    },
  });
  const index = useRef<number>(-1);
  const saveVideo = async (uploadedFile: UploadedFile) => {
    try {
      const formData = new FormData();
      formData.append("video", uploadedFile.file);
      formData.append("id", uploadedFile.id);
      const uploadRes = await fetch("http://localhost:4000/api/upload/video", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const error: VideoFileUploadResponse = await uploadRes.json();
        throw new Error(error.error || "Upload failed");
      }

      const { data, success, error }: VideoFileUploadResponse =
        await uploadRes.json();

      if (!success) {
        addToast({
          type: "error",
          duration: 4000,
          message: "Error while uploading the video. Try again.",
        });
        return;
      }
      videoId.current = data.id;
      let rawBuffer = "";
      const stream = streamVideoAnalysis(data.id, {
        forceBug: false,
        index: index.current++,
        onChunk: (text, eventType) => {
          if (eventType === "reasoning") {
            rawBuffer += JSON.parse(text);

            queueRef.current.push(rawBuffer);
            rawBuffer = "";

            if (!isProcessingRef.current) {
              processQueue();
            }
          }
        },
        onDone: (analysis) => {
          console.log("final result:", analysis);
          mutation.mutate({
            videoId: data.id,
            analysis,
          });
        },
        onError: (err, type) => {
          if (type === "json") {
            addToast({
              type: "error",
              duration: 6000,
              message:
                "There was an error with the analysis. The analysis is starting again",
            });
            setTimeout(() => {
              redoAnalysis();
            }, 1000);
          }
        },
      });
    } catch (error) {
      addToast({
        type: "error",
        duration: 6000,
        message:
          "There was an error with the analysis. The analysis is starting again",
      });
      redoAnalysis();
    } finally {
    }
  };
  const redoAnalysis = async () => {
    try {
      if (videoId.current < 0) return;
      setVideo(null);
      setResponse("");
      setAnalysisCompleted(false);
      queueRef.current = [];
      isProcessingRef.current = false;
      deleteVideo.mutate({ id: videoId.current });
    } catch (e) {}
  };
  const uploadVideo = async () => {
    try {
      const uploadedFile = filesRef.current.shift();
      const res = await saveVideo(uploadedFile!);
      if (filesRef.current.length === 0) {
        return;
      }
      setProcessing(filesRef.current[0]);
    } catch (e) {
      setProcessing(null);
      filesRef.current = [];
      addToast({
        type: "error",
        duration: 4000,
        message: "Error while uploading the video. Try again.",
      });
      return e;
    }
  };
  const processQueue = () => {
    isProcessingRef.current = true;

    if (queueRef.current.length > 0) {
      const block = queueRef.current.shift()!;

      setResponse((prev) => prev + block);

      setTimeout(processQueue, 500);
    }
  };
  const reset = () => {
    setVideo(null);
    setResponse("");
    setAnalysisCompleted(false);
    setProcessing(null);
    filesRef.current = [];
    queueRef.current = [];
    isProcessingRef.current = false;
  };
  useEffect(() => {
    console.log("###uploadingVideo", processing);
    if (processing === null) {
      return;
    }
    processingRef.current = processing;
    uploadVideo();
  }, [processing]);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Title>{analysisCompleted ? "Analysis Complete" : "Ad Analysis"}</Title>
      {!analysisCompleted ? (
        <Subtitle>Drop your ad here for instant analysis</Subtitle>
      ) : null}
      {!processing ? (
        <FileDragAndDrop
          accept={["video/mp4", "video/webm"]}
          onHandleFiles={(files: UploadedFile[]) => {
            const length = filesRef.current.length;
            if (length > QUEUE_LIMIT) {
              return;
            }
            const nextLength = length + files.length;
            if (nextLength > QUEUE_LIMIT) {
              for (const file of files) {
                filesRef.current.push(file);
                if (filesRef.current.length === QUEUE_LIMIT) {
                  break;
                }
              }
              return;
            }
            filesRef.current = [...filesRef.current, ...files];
            if (processing === null) {
              setProcessing(filesRef.current[0]);
            }
          }}
        />
      ) : analysisCompleted && video !== null ? (
        <AnalysisComplete video={video} reset={reset} />
      ) : (
        <div className="w-7/12 max-h-11/12 max-w-7/12 flex-1 p-6">
          <LLMTextResponseRenderer
            finished={analysisCompleted}
            text={response}
            onFinish={() => {
              setAnalysisCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default VideoAnalysisModal;

const onj = {
  keyMoments: [
    {
      id: 11,
      timestamp: 0.5,
      reason:
        "Introduction of the MonkeyFeet device, showing its unique application.",
      videoId: 181,
    },
    {
      id: 12,
      timestamp: 3,
      reason:
        "Demonstration of building specific muscle groups (quads, hamstrings, glutes).",
      videoId: 181,
    },
    {
      id: 13,
      timestamp: 9,
      reason:
        "The product reveal with text overlay 'THE FIRST DEVICE THAT ALLOWS YOU TO LIFT WEIGHT WITH YOUR FEET'.",
      videoId: 181,
    },
    {
      id: 14,
      timestamp: 14,
      reason: "Joe Rogan endorsement adds credibility and social proof.",
      videoId: 181,
    },
  ],
  suggestions: [
    {
      id: 10,
      recommendation:
        "Add more user-generated content or diverse user testimonials to showcase a wider range of people using MonkeyFeet.",
      reason:
        "This will enhance relatability and social proof, potentially increasing trust and conversion rates.",
      priority: "medium",
      videoId: 181,
    },
    {
      id: 11,
      recommendation:
        "Incorporate more dynamic text overlays that highlight key benefits or unique selling propositions throughout the video.",
      reason:
        "This can help viewers quickly grasp the value of the product, especially if they are watching with sound off.",
      priority: "high",
      videoId: 181,
    },
    {
      id: 12,
      recommendation:
        "Experiment with different trending audio tracks on TikTok to further increase discoverability and engagement.",
      reason:
        "Leveraging trending sounds can significantly boost reach and virality on the platform.",
      priority: "high",
      videoId: 181,
    },
  ],
  platformFit: {
    id: 4,
    bestPlatform: "TikTok",
    tiktokScore: 9,
    reelsScore: 8,
    shortsScore: 6,
    reasoning:
      "The fast-paced cuts, clear demonstration of a unique product, and the use of trending audio align perfectly with TikTok's algorithm and user preferences. Instagram Reels is also a strong contender due to its focus on short-form video.",
    videoId: 181,
  },
};
