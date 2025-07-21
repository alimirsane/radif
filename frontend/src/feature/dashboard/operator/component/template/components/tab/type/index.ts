import { InputHTMLAttributes } from "react";

export interface TabType {
  text: string;
  count: string;
  select: string | undefined;
  click: () => void;
  color: string | undefined;
}
