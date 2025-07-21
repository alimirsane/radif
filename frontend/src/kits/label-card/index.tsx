import { LabelCardType } from "./type";
import { Card } from "../card";
import { twMerge } from "tailwind-merge";

export const LabelCard = (props: LabelCardType) => {
  const { active, children, className, ...data } = props;

  return (
    <Card
      {...data}
      color={"paper"}
      className={twMerge(
        className,
        `relative flex w-fit items-center overflow-hidden rounded-[12px] py-[14px] pl-[12px] pr-[22px] transition-all duration-500 hover:shadow-md`,
      )}
    >
      <div
        className={`absolute right-0 h-full w-[13px] ${active ?? false ? "bg-secondary" : "bg-common-gray"}`}
      />
      <div>{children}</div>
    </Card>
  );
};
