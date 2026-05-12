import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover active:bg-primary-dark text-white border border-transparent",

  secondary:
    "bg-background-soft hover:bg-background-mute text-text border border-border",

  ghost:
    "bg-transparent hover:bg-background-mute text-text border border-transparent",

  danger:
    "bg-error hover:bg-error/90 active:bg-error/80 text-white border border-transparent",
};

function Button({
  id,
  children,
  className,
  variant = "primary",
  onClick,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={clsx(
        "px-3.5 h-9 rounded-md flex justify-center items-center cursor-pointer select-none transition-colors text-[13px] font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export default Button;
