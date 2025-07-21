import { RadioButtonTypes } from "@kit/radio/type";
import { FormikValues } from "formik/dist/types";

export interface FBRadioButtonType
  extends Omit<
    RadioButtonTypes<FormikValues>,
    "formik" | "children" | "value"
  > {
  items: { label: string; value: string | undefined }[];
}

