"use client";

import { useWillBotTour } from "@/providers/willbottour";
import Button from "@/ui/button";
import Modal from "@/ui/modal";
import VideoAnalysisModal from "@/ui/videoanalysismodal/videoanalysismodal";
import { usePathname } from "next/navigation";
import { TOUR_DATA } from "../dashboard/video-analysis/utils/TOUR_DATA";
import { HelpCircle } from "lucide-react";

type PathsTypes =
  | "/dashboard/video-analysis"
  | "/dashboard/compare-ads"
  | "/dashboard/willbot-tour"
  | "/dashboard/video-analysis";

const VIDEO_ANALYSIS_PATH: PathsTypes = "/dashboard/video-analysis";

const TITLES: Record<PathsTypes, string> = {
  "/dashboard/compare-ads": "Compare",
  "/dashboard/video-analysis": "Ads",
  "/dashboard/willbot-tour": "Willbot Tour",
};

function Topbar() {
  const { startTour } = useWillBotTour();
  const pathname = usePathname();
  const isAnalysisScreen = VIDEO_ANALYSIS_PATH === pathname;

  return (
    <div className="w-full h-20 px-6 bg-background-soft border-b border-b-background-mute flex justify-between items-center">
      <span className="text-text text-lg font-bold" id="top-bar-title">
        {TITLES[pathname as PathsTypes] || "Dashboard"}
      </span>
      <div className="flex justify-center items-center">
        <button
          onClick={() => startTour(TOUR_DATA)}
          className="hidden lg:flex mr-2 lg:mr-6"
        >
          <HelpCircle className="text-text-muted hover:text-text cursor-pointer" />
        </button>
        {isAnalysisScreen ? (
          <Modal
            title=""
            description=""
            trigger={
              <Button id="analyze-ad-button" className="">
                Analyze ad
              </Button>
            }
          >
            <VideoAnalysisModal />
          </Modal>
        ) : null}
      </div>
    </div>
  );
}

export default Topbar;
