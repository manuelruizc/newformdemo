import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import BadgeDropdown from "./badgedropdown";

function DropdownSelect({
  id,
  options,
  onClick,
}: {
  id?: string;
  options: { value: string; title: string }[];
  onClick: (type: string) => void;
}) {
  const [title, setTitle] = useState<string>(options[0].title);
  const [active, setActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      }
    }

    if (active) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active]);

  return (
    <div
      id={id}
      ref={dropdownRef}
      className={clsx("relative", !active && "text-text-muted")}
    >
      <BadgeDropdown title={title} active={active} onClick={() => setActive(!active)} />
      <div
        className={clsx(
          "absolute bottom-0 left-0 translate-y-full mt-1 w-48 bg-background-soft border border-border shadow-md z-100000 rounded-lg py-1 pointer-events-none duration-150 transition-all ease-out opacity-0",
          active && "pointer-events-auto! opacity-100 translate-y-[104%]",
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            className="w-full px-3 py-1.5 hover:bg-background-mute cursor-pointer text-left group"
            onClick={() => {
              onClick(option.value);
              setTitle(option.title);
              setActive(false);
            }}
          >
            <span className="text-sm text-text group-hover:text-text">
              {option.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DropdownSelect;
