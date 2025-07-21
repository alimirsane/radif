import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { ReactNode } from "react";

export interface SwitchTypes<FORMIK_VALUES extends FormikValues> {
  formik?: FormikProps<FORMIK_VALUES>;
  name?: string | undefined;
  children?: ReactNode;
}
