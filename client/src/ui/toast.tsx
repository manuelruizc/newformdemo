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
  const accent: Record<ToastType, string> = {
    info: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };

  const text: Record<ToastType, string> = {
    info: "text-primary",
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
    <div className="relative bg-background-soft border border-border rounded-lg pl-4 pr-3 py-3 flex items-center justify-between gap-3 shadow-md min-w-75 z-[99999999999999999] overflow-hidden">
      <span
        className={`absolute left-0 top-0 bottom-0 w-1 ${accent[type]}`}
        aria-hidden
      />
      <span className="text-text text-sm">{message}</span>
      {onClose ? (
        <button
          onClick={onClose}
          className={`transition-colors hover:cursor-pointer ${text[type]}`}
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
};
