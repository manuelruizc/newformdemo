"use client";
import { useEffect, useRef, useState } from "react";
import SearchInput from "./searchinput";
import clsx from "clsx";
import DropdownSelect from "./dropdownselect";
import Logo from "@/ui/logo";
import Button from "@/ui/button";
import Modal from "@/ui/modal";
import VideoAnalysisModal from "@/ui/videoanalysismodal/videoanalysismodal";
import { Plus } from "lucide-react";

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
}) {
  return (
    <div className="w-full h-20 flex flex-row justify-between items-center md:px-12 relative px-6 border-b border-border bg-background-soft">
      <div className="flex justify-center items-center gap-4">
        <div className="h-3 w-16 md:h-3.5 md:w-20">
          <Logo />
        </div>
        <span className="h-5 w-px bg-border hidden lg:block" aria-hidden />
        <span className="font-newform-mono! text-[11px] uppercase tracking-[0.18em] text-text-secondary mr-2 hidden lg:inline">
          Ads
        </span>
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
      </div>
      <div className="flex justify-end items-center gap-3">
        <SearchInput handleSearchChange={handleSearchChange} />
        <Modal
          title=""
          description=""
          trigger={
            <Button id="analyze-ad-button">
              <Plus strokeWidth={2} size={14} />
              <span>Analyze ad</span>
            </Button>
          }
        >
          <VideoAnalysisModal />
        </Modal>
      </div>
    </div>
  );
}

export default TopBar;
