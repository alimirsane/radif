import { Input } from "@kit/input";
import React from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { FBFileInputElementType } from "@module/form-builder/type/sample/file";

interface FBFileInputProps {
  formik: FormikProps<FormikValues>;
  properties: FBFileInputElementType;
}

export const FBFileInput = (props: FBFileInputProps) => {
  const { formik, properties } = props;

  return <Input formik={formik} {...properties} type="file" />;
};
