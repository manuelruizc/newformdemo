import Logo from "@/ui/logo";
import { SideboardButton } from "./sideboardbutton";
import Button from "@/ui/button";

function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-screen bg-background-mute flex justify-start items-start">
      <Sideboard />
      <div className="w-full h-full flex flex-col justify-start items-start pl-64">
        <div className="w-full h-20 px-6 bg-background-soft border-b border-b-background-mute flex justify-between items-center">
          <span className="text-text text-lg font-bold">Templates</span>
        </div>
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
      <Button className="w-9/12 mb-3">Chayanne</Button>
      <SideboardButton title="Ads" path="/dashboard/video-analysis" />
      <SideboardButton title="Compare Videos" path="/dashboard/compare-ads" />
      <SideboardButton title="Willbot Tour" path="/dashboard/willbot-tour" />
      <SideboardButton title="Upload" path="/dashboard/upload-ad" />
    </div>
  );
}

export default Dashboard;
