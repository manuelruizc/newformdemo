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
      <BadgeDropdown title={title} onClick={() => setActive(!active)} />
      <div
        className={clsx(
          "absolute bottom-0 left-0 translate-y-[98%] -translate-x-10 w-48 bg-background-soft border border-b-8 border-primary z-100000 rounded-2xl py-2 pointer-events-none duration-150 transition-all ease-in-out opacity-0",
          active && "pointer-events-auto! opacity-100 translate-y-[102%]",
        )}
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            className="w-full py-2 hover:bg-background-mute cursor-pointer rounded-lg group"
            onClick={() => {
              onClick(option.value);
              setTitle(option.title);
              setActive(false);
            }}
          >
            <span className="group-hover:text-primary text-xs md:text-base">
              {option.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DropdownSelect;
