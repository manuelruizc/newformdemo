import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover active:bg-primary-dark text-primary-glow outline-primary-dark/0 active:outline-primary-dark/30",

  secondary:
    "bg-transparent text-text outline-text-muted/0 active:outline-text-muted/30",

  ghost:
    "bg-transparent hover:bg-white/5 active:bg-white/10 text-foreground outline-white/0 active:outline-white/20",

  danger:
    "bg-error hover:bg-error/80 active:bg-error text-white outline-error/0 active:outline-error/30",
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
        "px-4 md:px-5 lg:px-6 py-2 rounded-xl outline-solid flex justify-center items-center cursor-pointer select-none transition-colors",
        VARIANTS[variant],
        className,
      )}
    >
      <span className="text-sm lg:text-base">{children}</span>
    </button>
  );
}

export default Button;
