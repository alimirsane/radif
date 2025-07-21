import { InputHTMLAttributes, ReactNode } from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";

export interface CheckboxType<FORMIK_VALUES extends FormikValues>
  extends Pick<InputHTMLAttributes<HTMLInputElement>, "name" | "value"> {
  defaultChecked?: boolean;
  value?: string | undefined;
  onChange?: (checked: boolean) => void;
  formik?: FormikProps<FORMIK_VALUES>;
  label?: string | ReactNode;
  // selectedValues: string[];
}
