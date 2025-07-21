import { Input } from "@kit/input";
import React from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { FBInputElementType } from "@module/form-builder/type/sample/input";

interface FBInputProps {
  formik: FormikProps<FormikValues>;
  properties: FBInputElementType;
}

export const FBInput = (props: FBInputProps) => {
  const { formik, properties } = props;
  return <Input formik={formik} {...properties} />;
};
