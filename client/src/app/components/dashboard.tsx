import Logo from "@/ui/logo";
import { SideboardButton } from "./sideboardbutton";
import Topbar from "./topbar";

function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-screen bg-background-mute flex justify-start items-start">
      <Sideboard />
      <div className="w-full h-full min-h-screen flex flex-col justify-start items-start pl-64">
        <Topbar />
        {children}
      </div>
    </div>
  );
}

function Sideboard() {
  return (
    <div className="fixed top-0 left-0 w-64 h-full min-h-screen max-h-screen bg-background-soft flex flex-col justify-start items-center border-r border-background-mute pt-4">
      <div className="w-8/12 h-12 flex justify-start items-center">
        <div className="w-8/12 h-12 flex justify-start items-center">
          <Logo />
        </div>
      </div>

      <SideboardButton title="Ads" path="/dashboard/video-analysis" />
      <SideboardButton title="Compare Videos" path="/dashboard/compare-ads" />
      <SideboardButton title="Willbot Tour" path="/dashboard/willbot-tour" />
      <SideboardButton title="Upload" path="/dashboard/upload-ad" />
    </div>
  );
}

export default Dashboard;
