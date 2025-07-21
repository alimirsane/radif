import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBButtonType } from "@module/form-builder/type/element/button";

export type FBButtonElementType = { element: FBElements.BUTTON } & Omit<
  FBCoreType,
  "validations" | "validationType"
> &
  FBButtonType;