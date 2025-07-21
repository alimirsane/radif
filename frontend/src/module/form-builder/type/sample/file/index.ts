import { FBElements } from "@module/form-builder/type/element";
import { FBCoreType } from "@module/form-builder/type/core";
import { FBFileInputType } from "@module/form-builder/type/element/fileInput";

export type FBFileInputElementType = { element: FBElements.FILE } & FBCoreType &
  FBFileInputType;
