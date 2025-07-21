import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBCollapseType } from "../../element/collapse";

export type FBCollapseElementType = {
  element: FBElements.COLLAPSE;
} & FBCoreType &
  FBCollapseType;
