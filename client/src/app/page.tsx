"use client";
import { trpc } from "@newformdemo/client/utils/trpc";
import Image from "next/image";

export default function Home() {
  // 1. Use the query hook.
  // 'greeting' matches the name in packages/trpc/index.ts
  const hello = trpc.greeting.useQuery({ name: "What is up my boi!!!!" });

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>tRPC Test</h1>

      {/* 2. Handle the loading and error states */}
      {hello.isLoading && <p>Loading from server...</p>}
      {hello.error && <p>Error: {hello.error.message}</p>}

      {/* 3. Display the data! */}
      {hello.data && (
        <div
          style={{
            border: "1px solid green",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <p>
            Server says: <strong>{hello.data.text}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
