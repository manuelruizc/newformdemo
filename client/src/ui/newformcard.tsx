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
        "rounded-2xl bg-background border-2 border-primary/40 border-b-8 border-b-primary",
        className
      )}
    >
      {children}
    </div>
  );
}

export default NewFormCard;
