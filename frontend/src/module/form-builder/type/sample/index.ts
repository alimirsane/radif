import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBInputElementType } from "@module/form-builder/type/sample/input";
import { FBSelectElementType } from "@module/form-builder/type/sample/select";
import { FBButtonElementType } from "@module/form-builder/type/sample/button";
import { FBRadioElementType } from "@module/form-builder/type/sample/radio";
import { FBCheckboxElementType } from "@module/form-builder/type/sample/checkbox";
import { FBFileInputElementType } from "@module/form-builder/type/sample/file";
import { FBCollapseElementType } from "./collapse";
import { FBTextAreaElementType } from "./textarea";

export type FBElementProp =
  | FBInputElementType
  | FBSelectElementType
  | FBButtonElementType
  | FBRadioElementType
  | FBCheckboxElementType
  | FBFileInputElementType
  | FBCollapseElementType
  | FBTextAreaElementType
  | ({ element: FBElements.FILE } & FBCoreType)
  | FBCoreType;
