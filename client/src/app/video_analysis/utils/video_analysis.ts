export function streamVideoAnalysis(
  videoId: number,
  {
    onChunk,
    onDone,
    onError,
  }: {
    onChunk?: (chunk: string, eventType: any) => void;
    onDone?: (result: any) => void;
    onError?: (err: any) => void;
  }
) {
  const es = new EventSource(
    `http://localhost:4000/api/genaistreams/analyze_video/${videoId}`
  );

  let resultReceived = false;

  es.addEventListener("reasoning", (e) => {
    console.log("🧠 Reasoning:", e.data);
    if (onChunk) {
      onChunk(e.data, e.type);
    }
  });

  es.addEventListener("result", (e) => {
    console.log("📦 Raw result data:", e.data);

    try {
      // Parse the JSON string sent from server
      const result = JSON.parse(e.data);
      console.log("✅ Parsed result:", result);

      resultReceived = true;

      // Call onDone with the parsed object
      if (onDone) {
        onDone(result);
      }
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      console.error("Raw data was:", e.data);
      console.error("Data type:", typeof e.data);

      if (onError) {
        onError(err);
      }
    }
  });

  es.addEventListener("done", () => {
    console.log("🏁 Stream completed");

    if (!resultReceived) {
      console.warn("⚠️ Stream ended but no result was received");
    }

    es.close();
  });

  es.addEventListener("error", (e) => {
    console.error("❌ Error event received:", e);

    if (onError) {
      onError(e);
    }
  });

  es.onerror = (err) => {
    console.error("❌ SSE connection error:", err);

    if (onError) {
      onError(err);
    }

    es.close();
  };

  return {
    close() {
      es.close();
    },
  };
}
