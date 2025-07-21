import { InputType } from "@kit/input/type";
import { FormikValues } from "formik";
import { ReactElement } from "react";
import { WeeklyCalendarType } from "../weekly/type";

export interface PersianCalendarType<FORMIK_VALUES extends FormikValues>
  extends Omit<InputType<FORMIK_VALUES>, "passwordHandler">{
  onDateChange?: (selected_date: string) => void;
  holder?: (date: string) => (ReactElement | undefined);
}
