import { ColorTypes } from "@kit/common/color-type";

export interface chartType {
  label: string;
  data: number[];
  backgroundColor: ColorTypes;
  stack?: string;
}
