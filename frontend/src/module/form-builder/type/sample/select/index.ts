import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBInputType } from "@module/form-builder/type/element/input";
import { FBSelectType } from "@module/form-builder/type/element/select";

export type FBSelectElementType = {
  element: FBElements.SELECT_BOX;
} & FBCoreType &
  FBSelectType;
