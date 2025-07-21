import { SelectSingleType, SelectType } from "@kit/select/type";

export interface FBSelectType
  extends Omit<
    SelectSingleType<{ value: string; label: string }>,
    "formik" | "holder" | "children" | "endNode" | "startNode"
  > {
  hint?: string;
}
