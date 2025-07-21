import { InputType } from "@kit/input/type";
import { FormikValues } from "formik/dist/types";

export interface FBFileInputType
  extends Omit<InputType<FormikValues>, "formik" | "passwordHandler"> {}
