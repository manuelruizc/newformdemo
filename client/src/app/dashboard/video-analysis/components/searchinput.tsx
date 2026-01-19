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
      className={clsx(
        "duration-300 transition-all ease-in-out absolute top-0 left-0 w-full h-full flex justify-end items-center z-10 pointer-events-none px-6 md:px-16",
      )}
    >
      <div
        id="search-button"
        className={clsx(
          "w-24 h-10 bg-background-soft rounded-full aspect-square! relative duration-300 transition-all ease-in-out flex justify-start items-center",
          active && "w-full! mr-0! border-2 border-primary/70",
        )}
      >
        <input
          ref={ref}
          type="text"
          className={clsx(
            "w-full h-full rounded-full pl-6 font-semibold pointer-events-auto! text-sm md:text-base",
            !active && "w-0! pointer-events-none! opacity-0 h-0!",
          )}
          placeholder="Search..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "escape") {
              ref.current?.blur();
            }
          }}
          onBlur={() => setActive(false)}
          onFocus={() => setActive(true)}
        />
        <button
          className={clsx(
            "absolute top-0 left-0 w-full h-full flex justify-start items-center pl-3 border-2 border-text/50 rounded-full pointer-events-auto duration-300 ease-linear transition-all",
            active && "pointer-events-none! opacity-0",
          )}
          onClick={() => {
            ref.current?.focus();
            setActive(true);
          }}
        >
          <span className="font-bold text-text-secondary text-sm md:text-base">
            ⌘ + K
          </span>
        </button>
        <button
          onClick={() => setActive((prev) => !prev)}
          className={clsx(
            "absolute top-0 right-0 w-10 h-10 mr-0.5 flex justify-center items-center rounded-full transition-all duration-200 ease-in-out cursor-pointer pointer-events-auto!",
          )}
        >
          {active ? (
            <X className="mb-0.5" size="1.2em" />
          ) : (
            <Search className="mb-0.5" size="1.2em" />
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchInput;
