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
    "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white outline-red-700/0 active:outline-red-700/30",
};

function Button({
  children,
  className,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-6 py-2.5 rounded-xl outline-solid flex justify-center items-center cursor-pointer select-none transition-colors",
        VARIANTS[variant],
        className
      )}
    >
      <span>{children}</span>
    </button>
  );
}

export default Button;
