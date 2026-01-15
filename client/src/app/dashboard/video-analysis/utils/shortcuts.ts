import { useEffect } from "react";
import { tinykeys } from "tinykeys";

function useKeyboardShortcuts({
  handlers,
}: {
  handlers?: { [key: string]: (event: Event) => void };
}) {
  useEffect(() => {
    let unsubscribe = tinykeys(window, handlers);
    return () => {
      unsubscribe();
    };
  });
}

export default useKeyboardShortcuts;
