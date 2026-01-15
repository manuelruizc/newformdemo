import { X } from "lucide-react";
import { useEffect } from "react";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastProps {
  children?: React.ReactNode;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}
export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  children,
  duration = 4000,
}) => {
  const types: Record<ToastType, string> = {
    info: "bg-background-soft border-primary/70 border-b-primary",
    success: "bg-background-soft border-success/70 border-b-success",
    warning: "bg-background-soft border-warning/70 border-b-warning ",
    error: "bg-background-soft border-error/70 border-b-error",
  };

  const text: Record<ToastType, string> = {
    info: "text-text",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  useEffect(() => {
    if (!onClose) return () => {};
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${types[type]} border-2 border-b-8 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg min-w-[300px] backdrop-blur-sm z-[99999999999999999]`}
    >
      <span className="text-text text-sm">{message}</span>
      {onClose ? (
        <button
          onClick={onClose}
          className={`transition-colors hover:cursor-pointer ${text[type]}`}
        >
          <X />
        </button>
      ) : null}
    </div>
  );
};
