import { ReactElement } from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { InputType } from "@kit/input/type";

interface SelectCoreType<
  VALUE,
  ORIGINAL_VALUE,
  FORMIK_VALUES extends FormikValues = any,
> extends Omit<
    InputType<FORMIK_VALUES>,
    "list" | "children" | "name" | "defaultValue"
  > {
  options: Array<ORIGINAL_VALUE | undefined>;
  searchOn?: keyof ORIGINAL_VALUE;
  typeOfValue?: VALUE;
  name?: string;
  defaultValue?: VALUE;
  multiple?: boolean;
  resettable?: boolean;
  holder: (
    activeItems: VALUE,
    reset: () => void,
    deleteItem: (item: ORIGINAL_VALUE | undefined) => void,
  ) => ReactElement;
  children: (
    item: ORIGINAL_VALUE | undefined,
    activeItems: VALUE,
  ) => ReactElement;
  formik?: FormikProps<FORMIK_VALUES>;
  onItemChange?: (items: VALUE) => void;
}

export type SelectSingleType<
  VALUE,
  FORMIK_VALUES extends FormikValues = any,
> = {
  multiple?: false;
  holder: (activeItems: VALUE | undefined, reset: () => void) => ReactElement;
} & Omit<SelectCoreType<VALUE | undefined, VALUE, FORMIK_VALUES>, "multiple">;

export type SelectMultipleType<
  VALUE,
  FORMIK_VALUES extends FormikValues = any,
> = {
  multiple: true;
  holder: (
    activeItems: Array<VALUE | undefined>,
    reset: () => void,
    deleteItem: (item: VALUE | undefined) => void,
  ) => ReactElement;
} & Omit<
  SelectCoreType<Array<VALUE | undefined> | undefined, VALUE, FORMIK_VALUES>,
  "multiple"
>;

export type SelectType<VALUE, FORMIK_VALUES extends FormikValues = any> =
  | SelectMultipleType<VALUE, FORMIK_VALUES>
  | SelectSingleType<VALUE, FORMIK_VALUES>;
