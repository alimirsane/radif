import { FabType } from "./type";
import { twMerge } from "tailwind-merge";
import { Button } from "@kit/button";

export const Fab = (props: FabType) => {
  const { className, ...data } = props;

  return (
    <Button
      {...data}
      className={twMerge(
        "prevent-select flex aspect-square w-fit cursor-pointer select-none content-center items-center rounded-full shadow-sm shadow-background-paper-dark transition-all active:scale-[98%] active:shadow-inner",
        className,
      )}
    ></Button>
  );
};
