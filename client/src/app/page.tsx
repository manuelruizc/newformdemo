"use client";
import FileDragAndDrop from "@/components/dragandrop";

export default function Home() {
  return <FileDragAndDrop accept={["video/mp4", "video/webm"]} />;
}
