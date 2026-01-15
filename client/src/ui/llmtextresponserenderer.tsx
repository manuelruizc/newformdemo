import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import clsx from "clsx";

function LLMTextResponseRenderer({
  text,
  finished,
  onFinish,
}: {
  text: string;
  onFinish?: () => void;
  finished: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finished) return;
    if (onFinish) {
      const timer = setTimeout(() => {
        console.log("isFinished!!!");
        onFinish();
      }, 800);
    }
  }, [finished]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [text]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full h-full max-h-full overflow-y-auto scroll-smooth no-scrollbar"
      style={{
        msOverflowStyle: "none" /* IE and Edge */,
        scrollbarWidth: "none" /* Firefox */,
      }}
    >
      <div
        className="prose prose-invert max-w-none text-lg
                    prose-p:my-6
                    prose-h1:mt-10 prose-h1:mb-4 pb-20" // Added padding at bottom
      >
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {text}
        </ReactMarkdown>
        <div
          className={clsx(
            "w-3 h-3 aspect-square rounded-full bg-primary-dark/50 mt-6",
            text.length === 0 && "animate-bounce"
          )}
        >
          <div
            className={clsx(
              "w-full h-full aspect-square rounded-full bg-primary",
              text.length === 0 && "animate-pulse"
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default LLMTextResponseRenderer;
