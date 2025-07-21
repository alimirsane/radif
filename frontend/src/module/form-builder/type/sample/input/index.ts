import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBInputType } from "@module/form-builder/type/element/input";

export type FBInputElementType = { element: FBElements.INPUT } & FBCoreType &
  FBInputType;
