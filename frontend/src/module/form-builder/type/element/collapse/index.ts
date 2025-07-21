import { CollapseType } from "@kit/collapse/type";

export interface FBCollapseType extends CollapseType {
  items: { id: string; label: string; value: string }[];
}
