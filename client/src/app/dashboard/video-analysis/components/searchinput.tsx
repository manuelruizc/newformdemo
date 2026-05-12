import { useDebounce } from "@/utils/useDebounce";
import { useEffect, useRef, useState } from "react";
import useKeyboardShortcuts from "../utils/shortcuts";
import clsx from "clsx";
import { Search, X } from "lucide-react";

function SearchInput({
  handleSearchChange,
}: {
  handleSearchChange: (newSearch: string) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const debouncedSearch = useDebounce(text, 500);
  useKeyboardShortcuts({
    handlers: {
      "$mod+K": (event) => {
        setActive(true);
        ref.current?.focus();
      },
    },
  });

  useEffect(() => {
    handleSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (active) {
      ref.current?.focus();
      return;
    }
    ref.current?.blur();
  }, [active]);

  return (
    <div
      id="search-button"
      className={clsx(
        "h-9 bg-background-soft rounded-lg relative transition-all duration-200 ease-linear flex justify-start items-center border border-border",
        active ? "w-64 md:w-96" : "w-32 md:w-44",
        active && "ring-2 ring-primary/20 border-primary/40",
      )}
    >
        <Search
          strokeWidth={1.5}
          className={clsx(
            "absolute left-3 text-text-secondary pointer-events-none transition-opacity",
            active ? "opacity-100" : "opacity-60",
          )}
          size={16}
        />
        <input
          ref={ref}
          type="text"
          className={clsx(
            "w-full h-full bg-transparent pl-9 pr-10 text-sm text-text placeholder:text-text-muted pointer-events-auto! focus:outline-none rounded-lg",
            !active && "cursor-pointer",
          )}
          placeholder="Search ads"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "escape") {
              ref.current?.blur();
            }
          }}
          onBlur={() => setActive(false)}
          onFocus={() => setActive(true)}
          onClick={() => setActive(true)}
        />
        {active ? (
          <button
            onClick={() => {
              setText("");
              setActive(false);
            }}
            className="absolute right-2 w-7 h-7 flex justify-center items-center rounded-md hover:bg-background-mute text-text-secondary transition-colors cursor-pointer pointer-events-auto!"
          >
            <X strokeWidth={1.5} size={14} />
          </button>
        ) : (
          <span className="absolute right-2 font-newform-mono! text-[10px] tracking-wider text-text-muted border border-border rounded px-1.5 py-0.5 pointer-events-none">
            ⌘K
          </span>
        )}
    </div>
  );
}

export default SearchInput;
