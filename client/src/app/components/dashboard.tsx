import Logo from "@/ui/logo";
import { SideboardButton } from "./sideboardbutton";
import Topbar from "./topbar";
import { Menu } from "lucide-react";
import Sideboard from "./sideboard";

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

export default Dashboard;
