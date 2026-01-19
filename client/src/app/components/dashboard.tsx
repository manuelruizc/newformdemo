import Logo from "@/ui/logo";
import { SideboardButton } from "./sideboardbutton";
import Topbar from "./topbar";
import { Menu } from "lucide-react";

function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-screen bg-background-mute flex flex-col lg:flex-row justify-start items-start">
      <Sideboard />
      <div className="w-full h-full min-h-screen flex flex-col justify-start items-start lg:pl-64">
        <Topbar />
        {children}
      </div>
    </div>
  );
}

function Sideboard() {
  return (
    <div className="relative lg:fixed top-0 left-0 w-full bg lg:w-64 lg:h-full lg:min-h-screen max-h-screen pb-3 lg:pb-0 bg-background-soft flex flex-col justify-start items-center border-r border-background-mute pt-4 border-b border-b-background">
      <div className="w-full px-6 lg:px-0 lg:w-8/12  h-12 flex justify-between lg:justify-start items-center">
        <div className="w-[20%] sm:w-[15%] lg:w-8/12 h-8 lg:h-12 flex justify-center items-center">
          <Logo />
        </div>
        <button className="lg:hidden cursor-pointer hover:opacity-80 active:scale-90 transition-all duration-150 ease-out">
          <Menu />
        </button>
      </div>
      <div className="w-full hidden lg:block">
        <SideboardButton title="Ads" path="/dashboard/video-analysis" />
        <SideboardButton title="Analytics" path="/dashboard/compare-ads" />
        <SideboardButton
          title="Willbot Settings"
          path="/dashboard/willbot-tour"
        />
        <SideboardButton title="Profile" path="/dashboard/upload-ad" />
      </div>
    </div>
  );
}

export default Dashboard;
