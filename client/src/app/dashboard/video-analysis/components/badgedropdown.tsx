import clsx from "clsx";
import { ChevronDown } from "lucide-react";

function BadgeDropdown({
  title,
  active,
  onClick,
}: {
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex justify-center items-center px-3 h-9 bg-background-soft rounded-lg border border-border text-sm cursor-pointer transition-colors hover:bg-background-mute",
        active && "ring-2 ring-primary/20 border-primary/40",
      )}
    >
      <span className="text-text">{title}</span>
      <ChevronDown strokeWidth={1.5} className="ml-2 text-text-secondary" size={14} />
    </button>
  );
}

export default BadgeDropdown;
