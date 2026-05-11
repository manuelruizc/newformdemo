"use client";

import clsx from "clsx";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import willbotpeeking from "@/assets/willbotpeeking.png";

export interface TourStep {
  target: string;
  title?: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface WillBotTourContextType {
  isOpen: boolean;
  currentStep: number;
  steps: TourStep[];
  activeStep: TourStep | null;
  isFirstStep: boolean;
  isLastStep: boolean;
  startTour: (tourSteps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeTour: () => void;
}

const WillBotTourContext = createContext<WillBotTourContextType>({
  isOpen: false,
  currentStep: -1,
  steps: [],
  activeStep: null,
  isFirstStep: false,
  isLastStep: false,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  closeTour: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const WillBotTourProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [coords, setCoords] = useState<DOMRect | null>(null);
  const [messageHeight, setMessageHeight] = useState<number>(0);
  const messageRef = useRef<HTMLDivElement>(null);

  const startTour = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const closeTour = useCallback(() => {
    setIsOpen(false);
    setSteps([]);
    setCurrentStep(-1);
  }, []);

  useEffect(() => {
    if (currentStep >= 0 && steps[currentStep]) {
      const id = steps[currentStep].target;
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });

        const updateRect = () => {
          setCoords(element.getBoundingClientRect());
        };

        window.addEventListener("scroll", updateRect, {
          capture: true,
          passive: true,
        });
        window.addEventListener("resize", updateRect);
        updateRect();

        return () => {
          window.removeEventListener("scroll", updateRect, { capture: true });
          window.removeEventListener("resize", updateRect);
        };
      }
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (messageRef.current) {
      setMessageHeight(messageRef.current.offsetHeight);
    }
  }, [currentStep, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const clipPath = useMemo(() => {
    if (!coords) return "";
    const p = 8;
    const { top, left, bottom, right } = coords;

    return `polygon(
      0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 
      ${left - p}px ${top - p}px, 
      ${right + p}px ${top - p}px, 
      ${right + p}px ${bottom + p}px, 
      ${left - p}px ${bottom + p}px, 
      ${left - p}px ${top - p}px
    )`;
  }, [coords]);

  const messagePosition = useMemo(() => {
    if (!coords) return { top: 0, left: 0, position: "bottom" };

    const vH = window.innerHeight;
    const vW = window.innerWidth;
    const gap = 24;
    const pad = 16;
    const msgW = messageRef.current?.offsetWidth || 300;
    const msgH = messageHeight || 150;

    const spaceBelow = vH - coords.bottom - pad;
    const spaceAbove = coords.top - pad;
    const spaceRight = vW - coords.right - pad;
    const spaceLeft = coords.left - pad;

    let top = 0;
    let left = 0;
    let pos: "top" | "bottom" | "left" | "right" = "bottom";

    // Priority Check: Find a spot where it actually fits
    if (spaceBelow >= msgH + gap) {
      pos = "bottom";
      top = coords.bottom + gap;
      left = coords.left + coords.width / 2 - msgW / 2;
    } else if (spaceAbove >= msgH + gap) {
      pos = "top";
      top = coords.top - gap - msgH;
      left = coords.left + coords.width / 2 - msgW / 2;
    } else if (spaceRight >= msgW + gap) {
      pos = "right";
      top = coords.top + coords.height / 2 - msgH / 2;
      left = coords.right + gap;
    } else if (spaceLeft >= msgW + gap) {
      pos = "left";
      top = coords.top + coords.height / 2 - msgH / 2;
      left = coords.left - gap - msgW;
    } else {
      // Emergency Centered Fallback if element takes whole screen
      pos = "bottom";
      top = vH / 2 - msgH / 2;
      left = vW / 2 - msgW / 2;
    }

    return {
      top: Math.max(pad, Math.min(top, vH - msgH - pad)),
      left: Math.max(pad, Math.min(left, vW - msgW - pad)),
      position: pos,
    };
  }, [coords, messageHeight]);

  const mascotPosition = useMemo(() => {
    if (!coords) return null;

    const vH = window.innerHeight;
    const vW = window.innerWidth;
    const p = 8;
    const size = 70; // Mascot size
    const peek = 15; // Overlap
    const minSpace = size - peek; // Minimum space required on a side to show mascot

    // Available space on all sides
    const space = {
      top: coords.top - p,
      bottom: vH - coords.bottom - p,
      left: coords.left - p,
      right: vW - coords.right - p,
    };

    // Determine the best "free" edge for Willbot (opposite of message box)
    // AND verify if there is actually enough physical space on the screen
    let bestSide: "top" | "bottom" | "left" | "right" | "none" = "none";

    const pos = messagePosition.position;
    if (pos === "bottom" && space.top >= minSpace) bestSide = "top";
    else if (pos === "top" && space.bottom >= minSpace) bestSide = "bottom";
    else if (pos === "left" && space.right >= minSpace) bestSide = "right";
    else if (pos === "right" && space.left >= minSpace) bestSide = "left";
    else {
      // If opposite is blocked, try any other side that fits
      if (space.top >= minSpace && pos !== "top") bestSide = "top";
      else if (space.bottom >= minSpace && pos !== "bottom")
        bestSide = "bottom";
      else if (space.right >= minSpace && pos !== "right") bestSide = "right";
      else if (space.left >= minSpace && pos !== "left") bestSide = "left";
    }

    if (bestSide === "none") return { hide: true };

    switch (bestSide) {
      case "top":
        return {
          top: coords.top - p - size + peek,
          left: coords.left + coords.width / 2 - size / 2,
          rotate: "rotate-0",
        };
      case "bottom":
        return {
          top: coords.bottom + p - peek,
          left: coords.left + coords.width / 2 - size / 2,
          rotate: "rotate-180",
        };
      case "left":
        return {
          top: coords.top + coords.height / 2 - size / 2,
          left: coords.left - p - size + peek,
          rotate: "-rotate-90",
        };
      case "right":
        return {
          top: coords.top + coords.height / 2 - size / 2,
          left: coords.right + p - peek,
          rotate: "rotate-90",
        };
    }
  }, [coords, messagePosition]);

  const value = {
    isOpen,
    currentStep,
    steps,
    activeStep: steps[currentStep] || null,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1 && steps.length > 0,
    startTour,
    nextStep,
    prevStep,
    closeTour,
  };

  return (
    <WillBotTourContext.Provider value={value}>
      {children}
      <div
        className={clsx(
          "fixed inset-0 transition-all duration-300 z-[999999999]",
          isOpen
            ? "bg-black/40 pointer-events-auto"
            : "bg-transparent pointer-events-none"
        )}
        style={{ clipPath }}
      >
        {coords && isOpen && (
          <>
            {/* Peeking Mascot with Visibility Logic */}
            {!mascotPosition?.hide && (
              <div
                className={clsx(
                  "absolute transition-all duration-500",
                  mascotPosition?.rotate
                )}
                style={{
                  top: mascotPosition?.top,
                  left: mascotPosition?.left,
                  width: 70,
                  height: 70,
                  pointerEvents: "none",
                }}
              >
                <img
                  src={willbotpeeking.src}
                  alt="WillBot"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <button
              onClick={nextStep}
              className="absolute cursor-pointer opacity-0 pointer-events-auto"
              style={{
                width: coords.width + 16,
                height: coords.height + 16,
                top: coords.top - 8,
                left: coords.left - 8,
              }}
            />

            <div
              ref={messageRef}
              className="absolute pointer-events-auto bg-background-soft rounded-xl p-4 shadow-2xl transition-all duration-300 border border-white/10"
              style={{
                top: messagePosition.top,
                left: messagePosition.left,
                minWidth: 260,
                maxWidth: 400,
              }}
            >
              <div className="space-y-3">
                {steps[currentStep]?.title && (
                  <h3 className="font-bold text-lg leading-tight">
                    {steps[currentStep].title}
                  </h3>
                )}
                <p className="text-sm text-text-muted leading-relaxed">
                  {steps[currentStep]?.content}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs font-medium text-text-muted">
                    {currentStep + 1} / {steps.length}
                  </span>
                  <div className="flex gap-2">
                    {!value.isFirstStep && (
                      <button
                        onClick={prevStep}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-background-mute hover:bg-background-hard transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={value.isLastStep ? closeTour : nextStep}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-white hover:brightness-110 transition-all cursor-pointer"
                    >
                      {value.isLastStep ? "Done" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WillBotTourContext.Provider>
  );
};

export const useWillBotTour = () => useContext(WillBotTourContext);
