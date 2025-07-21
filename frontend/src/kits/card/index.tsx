import { CardType } from "./type";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

type cardTypes =
  | "card-paper"
  | "card-secondary"
  | "card-primary"
  | "card-info"
  | "card-error"
  | "card-warning"
  | "card-success"
  | "card-pending"
  | "card-default";

export const Card = (props: CardType) => {
  const { className, variant, coverage, color, ...data } = props;

  const typeStyle: cardTypes = useMemo(() => {
    switch (color) {
      case "info":
        return "card-info";
      case "error":
        return "card-error";
      case "paper":
        return "card-paper";
      case "success":
        return "card-success";
      case "secondary":
        return "card-secondary";
      case "warning":
        return "card-warning";
      case "primary":
        return "card-primary";
      case "black":
        return "card-primary";
      case "pending":
        return "card-pending";
      default:
        return "card-default";
    }
  }, [color]);

  const variantStyle = useMemo(() => {
    switch (variant) {
      case "outline":
        return "border-[1px] border-background-paper-dark";
      case "shadow":
        return "shadow-md shadow-background-paper-dark";
      default:
        return "";
    }
  }, [variant]);

  const coverageStyle = useMemo(() => {
    if (!(coverage ?? false)) return "";
    return "hover:scale-[98%] transition-all";
  }, [coverage]);

  return (
    <div
      {...data}
      className={twMerge(typeStyle, variantStyle, className, coverageStyle)}
    ></div>
  );
};
