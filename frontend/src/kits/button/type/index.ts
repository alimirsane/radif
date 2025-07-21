import { ButtonHTMLAttributes, ReactNode } from "react";
import { ColorTypes } from "@kit/common/color-type";

export interface ButtonType extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid" | "text";
  color?: ColorTypes;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  size?: "tiny" | "small" | "medium" | "large";
  shadow?: boolean;
}
