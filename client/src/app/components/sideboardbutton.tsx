"use client";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

export function SideboardButton({
  path,
  title,
}: {
  path: string;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === path;

  return (
    <div
      id={title.toLowerCase() === "ads" ? "ads-sideboard-button" : undefined}
      className="w-full flex justify-center items-center"
    >
      <button
        onClick={() => {
          router.push(path);
        }}
        className={clsx(
          "w-9/12 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-active transition-all duration-300 ease-out flex justify-start items-center px-3",
          isActive && "bg-sidebar-active",
        )}
      >
        <span
          className={clsx(
            "font-semibold",
            isActive ? "text-sidebar-text-active" : "text-sidebar-text",
          )}
        >
          {title}
        </span>
      </button>
    </div>
  );
}
