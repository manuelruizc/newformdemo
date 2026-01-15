export function streamVideoAnalysis(
  videoId: number,
  {
    onChunk,
    onDone,
    onError,
    forceBug,
    index,
  }: {
    onChunk?: (chunk: string, eventType: any) => void;
    onDone?: (result: any) => void;
    onError?: (err: any, type: "json" | "error" | "connection") => void;
    forceBug?: boolean;
    index?: number;
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
      if (forceBug && index && index < 0) {
        let errorJSON = JSON.parse(e.data + "}}{]][");
      }
      const result = JSON.parse(e.data);

      resultReceived = true;

      if (onDone) {
        onDone(result);
      }
    } catch (err) {
      if (onError) {
        onError(err, "json");
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
    if (onError) {
      onError(e, "error");
    }
  });

  es.onerror = (err) => {
    if (onError) {
      onError(err, "error");
    }

    es.close();
  };

  return {
    close() {
      es.close();
    },
  };
}
