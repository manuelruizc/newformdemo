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
    info: "bg-background-soft border-[#2a3532]/50",
    success:
      "bg-background-soft border-primary/50 shadow-[0_0_20px_rgba(0,250,154,0.2)]",
    warning:
      "bg-background-soft border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.2)]",
    error:
      "bg-background-soft border-error/50 shadow-[0_0_20px_rgba(255,51,102,0.2)]",
  };

  useEffect(() => {
    if (!onClose) return () => {};
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${types[type]} border-2 rounded-lg p-4 flex items-center justify-between gap-3 shadow-lg min-w-[300px] backdrop-blur-sm`}
    >
      <span className="text-white text-sm">{message}</span>
      {onClose ? (
        <button
          onClick={onClose}
          className="text-text-muted hover:text-white transition-colors hover:cursor-pointer"
        >
          <X />
        </button>
      ) : null}
    </div>
  );
};
