import React from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { TextArea } from "@kit/text-area";
import { FBTextAreaElementType } from "@module/form-builder/type/sample/textarea";

interface FBTextAreaProps {
  formik: FormikProps<FormikValues>;
  properties: FBTextAreaElementType;
}

export const FBTextArea = (props: FBTextAreaProps) => {
  const { formik, properties } = props;

  return <TextArea formik={formik} {...properties} />;
};
