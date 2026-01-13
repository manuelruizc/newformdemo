"use client";

import FileDragAndDrop from "@/ui/dragandrop";
import { useEffect, useRef, useState } from "react";
import { streamVideoAnalysis } from "./utils/video_analysis";
import LLMTextResponseRenderer from "@/ui/llmtextresponserenderer";

const QUEUE_LIMIT = 5;

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
function VideoPlayer({ src }: { src: string }) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    // Create blob URL from File object
    // const url = URL.createObjectURL(uploadedFile.file);
    setVideoUrl(src);

    // Cleanup blob URL when component unmounts or file changes
    return () => {
      //   URL.revokeObjectURL(url);
    };
  }, [src]);
  console.log({ videoUrl });
  return (
    <video controls width="100%" src={videoUrl} style={{ maxWidth: "800px" }}>
      Your browser does not support the video tag.
    </video>
  );
}
function VideoAnalysis() {
  const [response, setResponse] = useState<string>("");
  const [videoPath, setVideoPath] = useState<string>("");
  const [numberOfFiles, setNumberOfFiles] = useState<number>(0);
  const [processing, setProcessing] = useState<UploadedFile | null>(null);
  const filesRef = useRef<UploadedFile[]>([]);
  const queueRef = useRef<string[]>([]);
  const reasoningRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  console.log(videoPath);
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
        console.error("Error on video upload", error);
        return;
      }
      let rawBuffer = "";
      setVideoPath(`http://localhost:4000/uploads/videos/${data.uniqueName}`);
      const stream = streamVideoAnalysis(data.id, {
        onChunk: (text, eventType) => {
          if (eventType === "reasoning") {
            rawBuffer += JSON.parse(text);

            // 🔥 Normalize SECTION_END as soon as it exists
            rawBuffer = rawBuffer.replace(/<SECTION_END>/g, "\n\n\n");

            queueRef.current.push(rawBuffer);
            rawBuffer = "";

            if (!isProcessingRef.current) {
              processQueue();
            }
          }
        },
        onDone: (full) => {
          const json = full;
          console.log("final result:", json);
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        "Upload failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
    }
  };
  const processQueue = () => {
    isProcessingRef.current = true;

    if (queueRef.current.length > 0) {
      const block = queueRef.current.shift()!;

      setResponse((prev) => prev + block);

      // Small delay just for perceived streaming
      setTimeout(processQueue, 500);
    } else {
      isProcessingRef.current = false;
    }
  };
  const uploadVideo = async () => {
    try {
      const uploadedFile = filesRef.current.shift();
      const res = await saveVideo(uploadedFile!);
      if (filesRef.current.length === 0) {
        setProcessing(null);
        return;
      }
      setProcessing(filesRef.current[0]);
    } catch (e) {
      setProcessing(null);
      filesRef.current = [];
      console.error(e);
      return e;
    }
  };

  useEffect(() => {
    if (processing === null) {
      return;
    }
    uploadVideo();
  }, [processing]);
  console.log(processing);

  return (
    <div className="w-full h-full min-h-screen">
      {videoPath.length > 0 ? (
        <VideoPlayer src={videoPath} />
      ) : (
        <FileDragAndDrop
          accept={["video/mp4", "video/webm"]}
          onHandleFiles={(files: UploadedFile[]) => {
            const length = filesRef.current.length;
            if (length > QUEUE_LIMIT) {
              console.error("Limit of video processing");
              return;
            }
            const nextLength = length + files.length;
            if (nextLength > QUEUE_LIMIT) {
              setNumberOfFiles(QUEUE_LIMIT);
              for (const file of files) {
                filesRef.current.push(file);
                if (filesRef.current.length === QUEUE_LIMIT) {
                  break;
                }
              }
              return;
            }
            filesRef.current = [...filesRef.current, ...files];
            setNumberOfFiles(filesRef.current.length);
            if (processing === null) {
              setProcessing(filesRef.current[0]);
            }
          }}
        />
      )}
      <div className="w-full flex justify-center items-center">
        <div className="w-7/12 max-w-7/12 px-6">
          <LLMTextResponseRenderer text={response} />
        </div>
      </div>
    </div>
  );
}

export default VideoAnalysis;
