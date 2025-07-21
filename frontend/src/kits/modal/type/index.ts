import { HTMLAttributes } from "react";

export interface ModalType extends HTMLAttributes<HTMLDivElement> {
  dismissOutside?: boolean;
  fullscreen?: "xs" | "sm" | "md" | "lg" | "xl";
}
