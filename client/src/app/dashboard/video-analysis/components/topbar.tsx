import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SearchInput from "./searchinput";
import clsx from "clsx";
import DropdownSelect from "./dropdownselect";
import Button from "@/ui/button";
import BadgeDropdown from "./badgedropdown";
import JSZip from "jszip";
import { useAppFlow } from "@/providers/appflow";

const SORT_OPTIONS = [
  {
    title: "Newest",
    value: "newest",
  },
  {
    title: "Oldest",
    value: "oldest",
  },
  {
    title: "Hook (high to low)",
    value: "hook-high",
  },
  {
    title: "Hook (low to high)",
    value: "hook-low",
  },
];

const FILTER_OPTIONS = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "High",
    value: "high",
  },
  {
    title: "Medium",
    value: "medium",
  },
  {
    title: "Low",
    value: "low",
  },
];

function TopBar({
  filterBy,
  sortBy,
  adsSelected,
  multiSelectionEnabled,
  setAdsSelected,
  setMultiSelectionEnabled,
  handleSortChange,
  handleFilterChange,
  handleSearchChange,
}: {
  filterBy: "all" | "high" | "medium" | "low";
  sortBy: "newest" | "oldest" | "hook-high" | "hook-low";
  handleFilterChange: (newFilter: "all" | "high" | "medium" | "low") => void;
  handleSortChange: (
    newFilter: "newest" | "oldest" | "hook-high" | "hook-low",
  ) => void;
  handleSearchChange: (newSearch: string) => void;
  multiSelectionEnabled: boolean;
  setAdsSelected: Dispatch<SetStateAction<Record<number, string>>>;
  adsSelected: Record<number, string>;
  setMultiSelectionEnabled: Dispatch<SetStateAction<boolean>>;
}) {
  const [regular, setRegular] = useState<boolean>(true);
  const { addToast } = useAppFlow();
  const numberOfAds = useMemo(
    () => Object.keys(adsSelected).length,
    [adsSelected],
  );

  async function downloadAllVideos() {
    const keys = Object.keys(adsSelected);

    for (const key of keys) {
      const numberKey = Number(key);
      const filePath = adsSelected[numberKey];

      // Convert file path to server URL
      // Assuming your server serves /uploads at http://localhost:3000/uploads
      const fileName = filePath.split("/").pop();
      const uri = `http://localhost:4000/uploads/videos/${fileName}`;

      try {
        const response = await fetch(uri);
        if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = fileName ?? "video.mp4";

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
      } catch (error) {
        addToast({
          type: "error",
          message: `Download failed`,
          duration: 4000,
        });
        console.error(`Error downloading ${fileName}:`, error);
      }

      setAdsSelected({});
    }
    addToast({
      type: "success",
      message: `${keys.length} ${keys.length === 1 ? "ad" : "ads"} downloaded`,
      duration: 4000,
    });
  }

  async function downloadAllVideosAsZip() {
    const keys = Object.keys(adsSelected);
    const zip = new JSZip();

    // Generate name: [numberofitems]ads-newform-[date with year]
    const numberOfItems = keys.length;
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2); // Last 2 digits (e.g., "24" for 2024)
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 01-12
    const day = String(today.getDate()).padStart(2, "0"); // 01-31
    const zipFileName = `${numberOfItems}-ads-newform-${month}/${day}/${year}`; // e.g., "3ads-newform-020424"

    try {
      for (const key of keys) {
        const numberKey = Number(key);
        const filePath = adsSelected[numberKey];
        const fileName = filePath.split("/").pop();
        const uri = `http://localhost:4000/uploads/videos/${fileName}`;

        console.log(`Adding to zip: ${fileName}`);

        const response = await fetch(uri);
        if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);

        const blob = await response.blob();
        zip.file(fileName ?? "video.mp4", blob);
      }

      console.log("Generating zip file...");
      const zipBlob = await zip.generateAsync({ type: "blob" });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${zipFileName}.zip`; // e.g., "3ads-newform-020424.zip"
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setAdsSelected({});
      addToast({
        type: "success",
        message: `${keys.length} ${keys.length === 1 ? "ad" : "ads"} downloaded`,
        duration: 4000,
      });
    } catch (error) {
      addToast({
        type: "error",
        message: `Download failed`,
        duration: 4000,
      });
      console.error("Error creating zip:", error);
    }
  }

  const downloadVideos = () => {
    regular ? downloadAllVideos() : downloadAllVideosAsZip();
  };
  return (
    <div className="w-full h-24 flex flex-row justify-between items-center md:px-16 relative px-6">
      <div className="flex justify-center items-center py-4 md:py-0">
        <DropdownSelect
          id="sort-button"
          options={SORT_OPTIONS}
          onClick={(type: any) => {
            handleSortChange(type);
          }}
        />
        <DropdownSelect
          id="filter-button"
          options={FILTER_OPTIONS}
          onClick={(type: any) => {
            handleFilterChange(type);
          }}
        />
        <div className="flex justify-centerite items-center">
          <BadgeDropdown
            useChevron={false}
            title={
              multiSelectionEnabled ? "Disable selection" : "Enable selection"
            }
            onClick={() => {
              setMultiSelectionEnabled((prev) => {
                const next = !prev;
                if (!next) {
                  setAdsSelected({});
                }
                return next;
              });
            }}
          />
          {multiSelectionEnabled ? (
            <>
              <Button disabled={numberOfAds === 0} onClick={downloadVideos}>
                {numberOfAds === 0
                  ? "No ads selected"
                  : numberOfAds === 1
                    ? "Download ad"
                    : `Download ${numberOfAds} ads`}
              </Button>
              <Button
                variant="ghost"
                disabled={numberOfAds === 0}
                onClick={() => setAdsSelected({})}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                className="bg-blue-500!"
                onClick={() => setRegular((prev) => !prev)}
              >
                {regular ? "Individual Files" : "ZIP Archive"}
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <div className="w-10 hidden md:block" />
      <SearchInput handleSearchChange={handleSearchChange} />
    </div>
  );
}

export default TopBar;
