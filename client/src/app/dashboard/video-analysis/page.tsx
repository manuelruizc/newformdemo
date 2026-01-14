"use client";

import FileDragAndDrop from "@/ui/dragandrop";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { streamVideoAnalysis } from "./utils/video_analysis";
import LLMTextResponseRenderer from "@/ui/llmtextresponserenderer";
import clsx from "clsx";
import { Grid, Grid2X2, List, Search, X } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdVideoItem, { VideoAdInterface } from "./components/AdVideoItem";
import EmptyStateList from "./components/EmptyStateList";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/utils/useDebounce";
import { useAppFlow } from "@/providers/appflow";

function VideoAnalysis() {
  const { adCreated } = useAppFlow();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<"all" | "high" | "medium" | "low">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "hook-high" | "hook-low"
  >("newest");
  const adsSaved = useRef<Set<number>>(new Set());

  const {
    data, // All pages of data
    fetchNextPage, // Function to load more
    hasNextPage, // Boolean: is there more data?
    isFetchingNextPage, // Boolean: is it loading more?
    isLoading, // Boolean: initial load
    refetch, // Function to reset and refetch
  } = trpc.video.searchAndFilter.useInfiniteQuery(
    // First argument: query input (without cursor)
    {
      searchTerm,
      filterBy,
      sortBy,
      limit: 12,
    },
    // Second argument: configuration
    {
      // ✅ This function tells tRPC how to get the next cursor
      getNextPageParam: (lastPage) => {
        // lastPage is the result from your backend: { videos, nextCursor }
        // Return the nextCursor to fetch the next page
        // If it's undefined, there are no more pages
        return lastPage.nextCursor;
      },

      // Optional: Configure refetch behavior
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  const utils = trpc.useUtils();
  const addVideoToCache = (newVideo: VideoAdInterface) => {
    try {
      newVideo.recentlyAdded = true;
      utils.video.searchAndFilter.setInfiniteData(
        {
          searchTerm,
          filterBy,
          sortBy,
          limit: 12,
        },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [
                {
                  videos: [newVideo],
                  nextCursor: undefined,
                },
              ],
              pageParams: [null],
            };
          }

          const updatedPages = [...oldData.pages];
          console.log("added");
          // ✅ Different insertion logic based on sort
          switch (sortBy) {
            case "newest":
              // Add to beginning of first page
              updatedPages[0] = {
                ...updatedPages[0],
                videos: [newVideo, ...updatedPages[0].videos],
              };
              break;

            case "oldest":
              // Add to end of last page
              const lastPageIndex = updatedPages.length - 1;
              updatedPages[lastPageIndex] = {
                ...updatedPages[lastPageIndex],
                videos: [...updatedPages[lastPageIndex].videos, newVideo],
              };
              break;

            case "hook-high":
            case "hook-low":
              // For hook-based sorting, just refetch to maintain correct order
              // Inserting in correct position is complex, refetch is cleaner
              return oldData; // Don't modify, will refetch below
          }

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );

      // ✅ If hook-based sort, refetch to get correct order
      if (sortBy === "hook-high" || sortBy === "hook-low") {
        refetch();
      }
    } catch (e) {
      console.error("error", e);
    }
  };
  const allVideos = data?.pages.flatMap((page) => page.videos) ?? [];
  const handleFilterChange = (newFilter: typeof filterBy) => {
    setFilterBy(newFilter);
    refetch();
  };
  const handleSortChange = (newFilter: typeof sortBy) => {
    setSortBy(newFilter);
    refetch();
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    refetch();
  };

  useEffect(() => {
    // If the bottom div is visible and there is more data, fetch it
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (adCreated === null) {
      return;
    }
    if (adsSaved.current.has(adCreated.id)) return;
    adsSaved.current.add(adCreated.id);
    addVideoToCache(adCreated);
  }, [adCreated]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-start flex-1 pb-32">
      <TopBar
        handleFilterChange={handleFilterChange}
        filterBy={filterBy}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        handleSearchChange={handleSearchChange}
      />
      {allVideos.length === 0 ? (
        <EmptyStateList />
      ) : (
        <div className="w-full flex-1 flex justify-start items-start flex-wrap px-16 mt-2">
          {allVideos.map((video) => (
            <AdVideoItem key={video.id} video={video as VideoAdInterface} />
          ))}
          <div
            ref={ref}
            className="w-full h-20 flex justify-center items-center"
          >
            {isFetchingNextPage ? (
              <span className="text-gray-500 animate-pulse">
                Loading more videos...
              </span>
            ) : hasNextPage ? (
              <span className="text-transparent">Load More</span>
            ) : (
              <span className="text-gray-400 text-sm">
                No more videos to show
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeButton({
  title,
  active,
  onClick,
}: {
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex justify-center items-center px-4 py-2 bg-background-soft rounded-full border border-background-mute text-primary font-semibold cursor-pointer transition-all duration-150 ease-out mr-3.5 hover:scale-105 active:scale-100 active:opacity-80",
        !active && "text-text-muted"
      )}
    >
      {title}
    </button>
  );
}

function TwoOptionSwitch() {
  const [index, setIndex] = useState<number>(0);
  return (
    <div className="flex w-24 h-12 justify-between items-center bg-background-mute rounded-full border border-background-soft relative">
      <div
        className={clsx(
          "transition-all duration-300 ease-out flex justify-center items-center absolute top-0 left-0 w-1/2 z-0 h-full pointer-events-none",
          index === 1 && "translate-x-full"
        )}
      >
        <div className="w-10/12 h-10/12 bg-background-soft rounded-full aspect-square!" />
      </div>
      <button
        onClick={() => {
          setIndex(0);
        }}
        className="w-1/2 h-full flex justify-center items-center z-10 cursor-pointer"
      >
        <Grid2X2
          className={clsx(
            "transition-all duration-200 ease-in-out",
            index === 0 ? "text-text" : "text-text-muted"
          )}
          size={20}
        />
      </button>
      <button
        onClick={() => {
          setIndex(1);
        }}
        className="w-1/2 h-full flex justify-center items-center z-10 cursor-pointer"
      >
        <List
          className={clsx(
            "transition-all duration-200 ease-in-out",
            index === 1 ? "text-text" : "text-text-muted"
          )}
          size={20}
        />
      </button>
    </div>
  );
}

const BADGES = [
  {
    title: "All",
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
    newFilter: "newest" | "oldest" | "hook-high" | "hook-low"
  ) => void;
  handleSearchChange: (newSearch: string) => void;
}) {
  return (
    <div className="w-full h-24 flex justify-between items-center px-4 relative">
      <div className="h-full flex justify-start items-center">
        <BadgeButton
          title="All"
          onClick={() => handleFilterChange("all")}
          active={filterBy === "all"}
        />
        <BadgeButton
          title="High"
          onClick={() => handleFilterChange("high")}
          active={filterBy === "high"}
        />
        <BadgeButton
          title="Medium"
          onClick={() => handleFilterChange("medium")}
          active={filterBy === "medium"}
        />
        <BadgeButton
          title="Low"
          onClick={() => handleFilterChange("low")}
          active={filterBy === "low"}
        />
      </div>
      <div className="h-full flex justify-start items-center">
        <BadgeButton
          title="Newest"
          onClick={() => handleSortChange("newest")}
          active={sortBy === "newest"}
        />
        <BadgeButton
          title="Hook (high to low)"
          onClick={() => handleSortChange("hook-high")}
          active={sortBy === "hook-high"}
        />
        <BadgeButton
          title="Hook (low to high)"
          onClick={() => handleSortChange("hook-low")}
          active={sortBy === "hook-low"}
        />
        <BadgeButton
          title="Oldest"
          onClick={() => handleSortChange("oldest")}
          active={sortBy === "oldest"}
        />
      </div>
      <TwoOptionSwitch />
      <SearchInput handleSearchChange={handleSearchChange} />
    </div>
  );
}

function SearchInput({
  handleSearchChange,
}: {
  handleSearchChange: (newSearch: string) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const debouncedSearch = useDebounce(text, 500);

  useEffect(() => {
    handleSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (active) {
      ref.current?.focus();
      return;
    }
    ref.current?.blur();
  }, [active]);

  return (
    <div
      className={clsx(
        "duration-300 transition-all ease-in-out absolute top-0 left-0 w-full h-full flex justify-end items-center z-10 pointer-events-none",
        active && "px-4"
      )}
    >
      <div
        className={clsx(
          "w-10 h-10 bg-background-soft mr-[8.5%] rounded-full aspect-square! relative duration-300 transition-all ease-in-out flex justify-start items-center",
          active && "w-full! mr-0! border-2 border-primary/70"
        )}
      >
        <input
          ref={ref}
          type="text"
          className={clsx(
            "w-full h-full rounded-full pr-10 pl-6 font-semibold",
            !active && "w-0! pointer-events-none! opacity-0 h-0!"
          )}
          placeholder="Search..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "escape") {
              ref.current?.blur();
            }
          }}
          onBlur={() => setActive(false)}
        />
        <button
          onClick={() => setActive((prev) => !prev)}
          className={clsx(
            "absolute top-0 right-0 w-10 h-10 flex justify-center items-center rounded-full transition-all duration-200 ease-in-out cursor-pointer pointer-events-auto!"
          )}
        >
          {active ? <X size={20} className="mb-0.5" /> : <Search size={20} />}
        </button>
      </div>
    </div>
  );
}

export default VideoAnalysis;
