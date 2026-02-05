import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 md:px-5 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-2xl",
};

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

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function Button({
  children,
  className,
  variant = "primary",
  size = "sm",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "outline-solid flex justify-center items-center cursor-pointer select-none transition-colors",
        VARIANTS[variant],
        SIZES[size],
        props.disabled && "opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Button;
