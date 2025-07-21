import { InputHTMLAttributes, ReactNode } from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { FormElementValidations } from "@api/service/form-response/type";

export interface InputType<FORMIK_VALUES extends FormikValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  endNode?: ReactNode;
  startNode?: ReactNode;
  formik?: FormikProps<FORMIK_VALUES>;
  passwordHandler?: boolean;
  validations?: FormElementValidations[];
}
