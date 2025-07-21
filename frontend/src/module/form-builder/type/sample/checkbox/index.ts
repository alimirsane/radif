import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBCheckboxType } from "@module/form-builder/type/element/checkbox";

export type FBCheckboxElementType = {
  element: FBElements.CHECKBOX_GROUP;
} & FBCoreType &
  FBCheckboxType;
