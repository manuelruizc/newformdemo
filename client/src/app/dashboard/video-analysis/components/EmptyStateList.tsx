import willbotempty from "@/assets/emptystatewillbot.png";
import { Description } from "@/ui/text";
import Image from "next/image";

function EmptyStateList() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center gap-3">
      <Image
        src={willbotempty}
        alt="Willbot Empty State"
        priority
        className="w-1/5 aspect-square object-contain opacity-50"
      />
      <span className="font-newform-mono! text-[11px] uppercase tracking-[0.18em] text-text-secondary">
        No results
      </span>
      <h2 className="text-xl font-medium tracking-tight text-text">
        I couldn’t find anything
      </h2>
      <Description>Want to try different filters?</Description>
    </div>
  );
}

export default EmptyStateList;
