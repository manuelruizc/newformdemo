import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { useEffect, useState } from "react";

function LLMTextResponseRenderer({ text }: { text: string }) {
  const formatted = text.replace(/<SECTION_END>/g, "\n\n\n");
  console.log(formatted);
  return (
    <div className="">
      <div
        className="prose prose-invert max-w-none text-lg
                    prose-p:my-6
                    prose-h1:mt-10 prose-h1:mb-4"
      >
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default LLMTextResponseRenderer;
