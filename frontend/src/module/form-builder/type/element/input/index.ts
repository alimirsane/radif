import { InputType } from "@kit/input/type";
import { FormikValues } from "formik/dist/types";

export interface FBInputType extends Omit<InputType<FormikValues>, "formik"> {}
