import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { ReactNode } from "react";

export interface RadioButtonTypes<FORMIK_VALUES extends FormikValues> {
  formik?: FormikProps<FORMIK_VALUES>;
  name?: string | undefined;
  value?: string | undefined;
  children?: ReactNode;
  label?: string;
  onChange?: (isChecked: boolean) => void;
}
