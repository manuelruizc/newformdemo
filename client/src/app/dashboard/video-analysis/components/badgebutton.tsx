import clsx from "clsx";

function BadgeButton({
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
        "flex justify-center items-center px-3 h-8 bg-background-soft rounded-lg border border-border text-sm cursor-pointer transition-colors hover:bg-background-mute",
        active ? "text-text" : "text-text-secondary",
      )}
    >
      {title}
    </button>
  );
}

export default BadgeButton;
