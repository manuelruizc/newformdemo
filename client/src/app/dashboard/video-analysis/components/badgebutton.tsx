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
        "flex justify-center items-center px-4 py-2 bg-background-soft rounded-full border border-background-mute text-primary font-semibold cursor-pointer transition-all duration-150 ease-out mr-3.5 hover:scale-105 active:scale-100 active:opacity-80",
        !active && "text-text-muted",
      )}
    >
      {title}
    </button>
  );
}

export default BadgeButton;
