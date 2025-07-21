import { StatusType } from "./type";
import { Card } from "../card";
import { twMerge } from "tailwind-merge";

export const Status = (props: StatusType) => {
  const { color, children, className, ...data } = props;
  return (
    <Card
      {...data}
      color={color}
      className={twMerge(
        className,
        `flex w-fit items-center gap-[5px] rounded-[20px] px-[10px] py-[5px] text-${color == "paper" ? "typography-main" : color} [&>*]:text-[13px] [&>*]:font-light`,
      )}
    >
      <div
        className={`h-[10px] w-[10px] rounded-full bg-${color == "paper" ? "common-black" : color}`}
      />
      <div>{children}</div>
    </Card>
  );
};
