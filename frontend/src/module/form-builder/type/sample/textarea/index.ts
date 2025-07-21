import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBTextAreaType } from "../../element/textarea";

export type FBTextAreaElementType = {
  element: FBElements.TEXT_AREA;
} & FBCoreType &
  FBTextAreaType;
