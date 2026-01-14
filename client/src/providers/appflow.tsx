"use client";
import { VideoAdInterface } from "@/app/dashboard/video-analysis/components/AdVideoItem";
import { Toast } from "@/ui/toast";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

type ToastType = "info" | "success" | "warning" | "error";
interface ToastState {
  id: string;
  type: ToastType;
  message: string;
  data?: any;
  onClose?: () => void;
  duration?: number;
}

interface AppFlowContextInterface {
  adCreated: VideoAdInterface | null;
  addToast: (toast: ToastState) => void;
  createUUID: () => string;
  removeToast: (id: string) => void;
  updateAdCreated: (ad: VideoAdInterface) => void;
}

const AppFlowContext = createContext<AppFlowContextInterface>({
  addToast: () => {},
  removeToast: () => {},
  createUUID: () => "",
  updateAdCreated: () => {},
  adCreated: null,
});

export const AppFlowContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [adCreated, setAdCreated] = useState<VideoAdInterface | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addProcessToast = (type: ToastState) => {
    setToasts((prev) => [...prev, { ...type }]);
  };

  const removeProcessToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateAdCreated = useCallback((newAd: VideoAdInterface) => {
    setAdCreated(newAd);
    setTimeout(() => {
      setAdCreated(null);
    }, 3000);
  }, []);

  return (
    <AppFlowContext.Provider
      value={{
        addToast: addProcessToast,
        removeToast: removeProcessToast,
        createUUID: () => uuidv4(),
        updateAdCreated,
        adCreated,
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-9999999999">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={toast.onClose}
            duration={toast.duration}
          ></Toast>
        ))}
      </div>
    </AppFlowContext.Provider>
  );
};

export const useAppFlow = () => useContext(AppFlowContext);
