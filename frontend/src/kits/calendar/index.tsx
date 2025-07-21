import React, { useEffect, useState } from "react";
import DatePicker, {
  CalendarProps,
  DatePickerProps,
} from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import persian from "react-date-object/calendars/persian";
import { Input } from "@kit/input";
import persian_fa from "react-date-object/locales/persian_fa";
import { IcChevronDown } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { PersianCalendarType } from "./type";
import { twMerge } from "tailwind-merge";
import { FormikValues } from "formik";

export const PersianCalendar = <FORMIK_VALUES extends FormikValues>(
  props: PersianCalendarType<FORMIK_VALUES> & {
    calendarOptions?: Omit<CalendarProps, "onChange"> & DatePickerProps;
  },
) => {
  const { onDateChange, calendarOptions, holder, ...rest } = props;
  const { className, formik, ...inputValues } = rest;
  const [value, setValue] = useState<any>(formik?.values[rest.name ?? ""]);
  useEffect(() => {
    onDateChange?.(value);
    if (!rest.name) return;
    if (value === formik?.values?.[rest.name]) return;
    formik?.setFieldValue(rest.name, value?.toDate?.().toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <>
      <DatePicker
        calendar={persian}
        plugins={[weekends()]}
        locale={persian_fa}
        calendarPosition="bottom-right"
        type="input"
        value={value}
        className="block"
        onChange={setValue}
        render={(value, openCalendar) =>
          React.cloneElement(
            holder?.(value) ?? (
              <Input
                className={twMerge("w-full cursor-pointer", className)}
                placeholder="انتخاب تاریخ"
                endNode={
                  <SvgIcon
                    className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
                    onClick={openCalendar}
                  >
                    <IcChevronDown />
                  </SvgIcon>
                }
                value={value}
                {...inputValues}
              />
            ),
            { onClick: openCalendar },
          )
        }
        {...calendarOptions}
      />
    </>
  );
};
