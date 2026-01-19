import clsx from "clsx";
import NewFormCard from "./newformcard";
import { Description, Subtitle, Title } from "./text";

function LevelCard({
  title,
  value,
  percentage,
  className,
}: {
  value: string;
  title: string;
  percentage?: number;
  className?: string;
}) {
  return (
    <NewFormCard
      className={clsx(
        "w-[32%] md:w-36 lg:w-[32%] h-24 xl:w-44 xl:h-28 flex flex-col justify-center items-center",
        className,
      )}
    >
      <Description className="uppercase font-medium tracking-wide xl:tracking-widest text-base">
        {title}
      </Description>
      <Title className="font-black text-base lg:text-xl xl:text-2xl">
        {value}
      </Title>
      {percentage ? (
        <div className="w-10/12 h-1 lg:h-1.5 overflow-hidden rounded-full bg-text-muted flex justify-start items-center mt-4">
          <div
            className="h-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : null}
    </NewFormCard>
  );
}

export default LevelCard;
