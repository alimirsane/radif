import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBRadioButtonType } from "@module/form-builder/type/element/radio";

export type FBRadioElementType = {
  element: FBElements.RADIO_GROUP;
} & FBCoreType &
  FBRadioButtonType;
