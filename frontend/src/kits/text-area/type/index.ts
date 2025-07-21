import { TextareaHTMLAttributes, ReactNode } from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { FormElementValidations } from "@api/service/form-response/type";

export interface TextAreaType<FORMIK_VALUES extends FormikValues>
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  formik?: FormikProps<FORMIK_VALUES>;
  validations?: FormElementValidations[];
}
