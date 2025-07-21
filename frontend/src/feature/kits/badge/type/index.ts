import { ColorTypes } from "@kit/common/color-type";
import { HTMLAttributes } from "react";
export interface BadgeType extends HTMLAttributes<HTMLDivElement> {
  color?: ColorTypes;
}
