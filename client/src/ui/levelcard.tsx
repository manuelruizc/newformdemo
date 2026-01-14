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
        "w-48 h-32 flex flex-col justify-center items-center",
        className
      )}
    >
      <Description className="uppercase tracking-widest font-medium">
        {title}
      </Description>
      <Title className="font-black">{value}</Title>
      {percentage ? (
        <div className="w-10/12 h-2 overflow-hidden rounded-full bg-text-muted flex justify-start items-center mt-4">
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
