import { TextAreaType } from "@kit/text-area/type";
import { FormikValues } from "formik/dist/types";

export interface FBTextAreaType extends Omit<TextAreaType<FormikValues>, "formik"> {}
