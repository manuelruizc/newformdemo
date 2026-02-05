"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, Grid, Grid2X2, List, Search, X } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdVideoItem, { VideoAdInterface } from "./components/AdVideoItem";
import EmptyStateList from "./components/EmptyStateList";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/utils/useDebounce";
import { useAppFlow } from "@/providers/appflow";
import useKeyboardShortcuts from "./utils/shortcuts";
import TopBar from "./components/topbar";

function VideoAnalysis() {
  const [multiSelectionEnabled, setMultiSelectionEnabled] =
    useState<boolean>(false);
  const [adsSelected, setAdsSelected] = useState<Record<number, string>>({});
  const { adCreated, addToast } = useAppFlow();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "hook-high" | "hook-low"
  >("newest");
  const adsSaved = useRef<Set<number>>(new Set());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = trpc.video.searchAndFilter.useInfiniteQuery(
    {
      searchTerm,
      filterBy,
      sortBy,
      limit: 12,
    },

    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
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
          switch (sortBy) {
            case "newest":
              updatedPages[0] = {
                ...updatedPages[0],
                videos: [newVideo, ...updatedPages[0].videos],
              };
              break;

            case "oldest":
              const lastPageIndex = updatedPages.length - 1;
              updatedPages[lastPageIndex] = {
                ...updatedPages[lastPageIndex],
                videos: [...updatedPages[lastPageIndex].videos, newVideo],
              };
              break;

            case "hook-high":
            case "hook-low":
              return oldData;
          }

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );
      if (sortBy === "hook-high" || sortBy === "hook-low") {
        refetch();
      }
    } catch (e) {}
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
        multiSelectionEnabled={multiSelectionEnabled}
        adsSelected={adsSelected}
        setMultiSelectionEnabled={setMultiSelectionEnabled}
        setAdsSelected={setAdsSelected}
      />
      {allVideos.length === 0 ? (
        <EmptyStateList />
      ) : (
        <div className="w-full flex-1 flex justify-start items-start flex-wrap px-16 mt-2">
          {allVideos.map((video, index) => (
            <AdVideoItem
              id={index === 0 ? "first-ad" : undefined}
              key={video.id}
              video={video as VideoAdInterface}
              adsSelected={adsSelected}
              multiSelectionEnabled={multiSelectionEnabled}
              setMultiSelectionEnabled={setMultiSelectionEnabled}
              setAdsSelected={setAdsSelected}
            />
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

export default VideoAnalysis;
