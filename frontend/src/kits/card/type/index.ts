import { HTMLAttributes } from "react";
import { ColorTypes } from "@kit/common/color-type";

export interface CardType extends HTMLAttributes<HTMLDivElement> {
  color?: ColorTypes;
  coverage?: boolean;
  variant?: "shadow" | "flat" | "outline";
}
