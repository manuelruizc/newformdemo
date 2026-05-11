"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

// Define the structure of a single tour step
export interface TourStep {
  target: string; // CSS Selector (e.g., '#submit-button')
  title?: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

// Define the Context shape
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
  startTour: (tourSteps: TourStep[]) => {},
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
  }, []);

  useEffect(() => {
    if (currentStep >= 0) {
      const id = steps[currentStep].target;

      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords(rect);

        // Optional: Smooth scroll the element into view so the tour doesn't break
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, steps]);

  const value: WillBotTourContextType = {
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

  const clipPath = useMemo(() => {
    if (!coords) return "";
    const p = 8; // padding around the element
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

  return (
    <WillBotTourContext.Provider value={value}>
      {children}

      <div
        className={`fixed inset-0  z-50 pointer-events-none! transition-all duration-300 ${
          isOpen ? "backdrop-blur-xs" : "backdrop-blur-none"
        }`}
        style={{ clipPath, borderRadius: 12 }}
      >
        {coords && (
          <button
            onClick={nextStep}
            className={`cursor-pointer absolute pointer-events-auto! opacity-0 ${
              isOpen
                ? "bg-blue-800 hover:bg-blue-500 active:bg-blue-300"
                : "bg-orange-500"
            }`}
            style={{
              width: coords?.width,
              height: coords?.height,
              top: coords?.top,
              left: coords?.left,
              transform: `translateY(-50%)`,
              zIndex: 9999,
            }}
          ></button>
        )}
      </div>
    </WillBotTourContext.Provider>
  );
};

export const useWillBotTour = () => React.useContext(WillBotTourContext);
