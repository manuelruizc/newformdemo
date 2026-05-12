import clsx from "clsx";
import NewFormCard from "./newformcard";
import { Title } from "./text";

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
        "w-[32%] md:w-36 lg:w-[32%] h-24 xl:w-44 xl:h-28 flex flex-col justify-center items-center px-3",
        className,
      )}
    >
      <span className="font-newform-mono! text-[10px] uppercase tracking-[0.18em] text-text-secondary">
        {title}
      </span>
      <Title className="font-semibold text-lg lg:text-xl xl:text-2xl mt-1 text-center">
        {value}
      </Title>
      {percentage ? (
        <div className="w-10/12 h-1 overflow-hidden rounded-full bg-background-mute flex justify-start items-center mt-3">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : null}
    </NewFormCard>
  );
}

export default LevelCard;
