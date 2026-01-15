import willbotempty from "@/assets/emptystatewillbot.png";
import { Description, Subtitle, Title } from "@/ui/text";
import Image from "next/image";

function EmptyStateList() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center">
      <Image
        src={willbotempty}
        alt="Willbot Empty State"
        priority
        className="w-1/4 aspect-square object-contain opacity-70"
      />
      <Subtitle className="font-newform">I couldn’t find anything</Subtitle>
      <Description>Want to try different filters?</Description>
    </div>
  );
}

export default EmptyStateList;
