import clsx from "clsx";

function NewFormCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-lg bg-background-soft border border-border shadow-xs",
        className
      )}
    >
      {children}
    </div>
  );
}

export default NewFormCard;
