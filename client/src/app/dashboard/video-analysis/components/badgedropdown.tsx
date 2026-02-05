import clsx from "clsx";
import { ChevronDown } from "lucide-react";

function BadgeDropdown({
  title,
  active,
  useChevron = true,
  onClick,
}: {
  title: string;
  active?: boolean;
  useChevron?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex justify-center items-center px-3 py-2 md:px-4 bg-background-soft rounded-full border border-background-mute text-primary font-semibold cursor-pointer transition-all duration-150 ease-out mr-3.5 hover:scale-105 active:scale-100 active:opacity-80",
        !active && "text-text-muted",
      )}
    >
      <span className="text-sm">{title}</span>
      {useChevron && <ChevronDown className="ml-2" size="1.3em" />}
    </button>
  );
}

export default BadgeDropdown;
