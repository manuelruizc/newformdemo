"use client";

import Button from "@/ui/button";
import Modal from "@/ui/modal";
import VideoAnalysisModal from "@/ui/videoanalysismodal/videoanalysismodal";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isAnalysisScreen = VIDEO_ANALYSIS_PATH === pathname;

  return (
    <div className="w-full h-20 px-6 bg-background-soft border-b border-b-background-mute flex justify-between items-center">
      <span className="text-text text-lg font-bold">
        {TITLES[pathname as PathsTypes] || "Dashboard"}
      </span>
      {isAnalysisScreen ? (
        <Modal
          title=""
          description=""
          trigger={<Button className="">Analyze ad</Button>}
        >
          <VideoAnalysisModal />
        </Modal>
      ) : null}
    </div>
  );
}

export default Topbar;
