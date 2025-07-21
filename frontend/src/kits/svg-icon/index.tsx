import { SvgIconTypes } from "@kit/svg-icon/type";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export const SvgIcon = (props: SvgIconTypes) => {
  const { children, strokeColor, fillColor, className, ...data } = props;

  const strokeStyle = useMemo(() => {
    switch (strokeColor) {
      case "warning":
        return "[&_path]:stroke-warning";
      case "info":
        return "[&_path]:stroke-info";
      case "success":
        return "[&_path]:stroke-success";
      case "paper":
        return "[&_path]:stroke-background-paper";
      case "error":
        return "[&_path]:stroke-error";
      case "secondary":
        return "[&_path]:stroke-secondary";
      case "primary":
        return "[&_path]:stroke-primary";
      case "white":
        return "[&_path]:stroke-common-white";
      case "black":
        return "[&_path]:stroke-common-black";
      default:
        return "";
    }
  }, [strokeColor]);

  const fillStyle = useMemo(() => {
    switch (fillColor) {
      case "warning":
        return "[&_path]:fill-warning";
      case "info":
        return "[&_path]:fill-info";
      case "success":
        return "[&_path]:fill-success";
      case "paper":
        return "[&_path]:fill-background-paper";
      case "error":
        return "[&_path]:fill-error";
      case "secondary":
        return "[&_path]:fill-secondary";
      case "primary":
        return "[&_path]:fill-primary";
      case "white":
        return "[&_path]:fill-common-white";
      case "black":
        return "[&_path]:fill-common-black";
      default:
        return "";
    }
  }, [fillColor]);

  return (
    <div {...data} className={twMerge(className, strokeStyle, fillStyle)}>
      {children}
    </div>
  );
};
