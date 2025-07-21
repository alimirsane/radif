import { CheckboxType } from "@kit/checkbox/type";
import { FormikValues } from "formik/dist/types";

export interface FBCheckboxType
  extends Omit<CheckboxType<FormikValues>, "formik" | "value"> {
  items: { label: string; value: string | undefined }[];
  selectedValues: string[];
}
