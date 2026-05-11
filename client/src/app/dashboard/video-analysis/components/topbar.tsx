import { useEffect, useRef, useState } from "react";
import SearchInput from "./searchinput";
import clsx from "clsx";
import DropdownSelect from "./dropdownselect";

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
      </div>
      <div className="w-10 hidden md:block" />
      <SearchInput handleSearchChange={handleSearchChange} />
    </div>
  );
}

export default TopBar;
