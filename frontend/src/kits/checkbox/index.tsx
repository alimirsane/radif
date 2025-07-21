import { CheckboxType } from "@kit/checkbox/type";
import { twMerge } from "tailwind-merge";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormikValues } from "formik/dist/types";

export const CHECKBOX_SEPARATOR = "#@!";

export const Checkbox = <FORMIK_VALUES extends FormikValues>(
  props: CheckboxType<FORMIK_VALUES>,
) => {
  const { defaultChecked, onChange, label, name, formik, value } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [checked, setChecked] = useState(defaultChecked ?? false);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (!name) return;
    let newValue;
    if (value) {
      const selectedValues =
        formik?.values?.[name]?.split(CHECKBOX_SEPARATOR) ?? [];
      if (event.target.checked) {
        newValue = [...selectedValues, value]?.filter(
          (item) => item !== undefined,
        );
      } else {
        newValue = selectedValues?.filter(
          (itemValue: any) => itemValue !== value,
        );
      }
      formik?.setFieldValue(name, newValue.join(CHECKBOX_SEPARATOR));
    } else {
      formik?.setFieldValue(name, event.target.checked);
    }
  };

  useEffect(() => {
    onChange?.(checked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const isCheck = useMemo(() => {
    if (!value) return checked;
    if (!name) return;
    const selectedValues =
      formik?.values?.[name]?.split(CHECKBOX_SEPARATOR) ?? [];
    return selectedValues.includes(value);
  }, [checked, formik?.values, name, value]);

  return (
    <div className="">
      <label
        className={`relative flex items-center gap-1 ${!value ? "text-xs" : ""} ${!value && formik?.errors?.[name ?? ""] ? "text-error" : ""}`}
      >
        <input
          ref={inputRef}
          onChange={handleOnChange}
          checked={isCheck}
          onBlur={formik?.handleBlur}
          type="checkbox"
          value={value}
          name={name}
          className="min-h-[24px] min-w-[24px] cursor-pointer appearance-none rounded-md border border-background-paper-dark transition-all duration-150 checked:border-primary checked:bg-primary checked:bg-center checked:bg-no-repeat"
        />
        <svg
          className={twMerge(
            checked ? "opacity-100" : "opacity-0",
            "absolute z-20 transition-all duration-500",
          )}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="m7.75 12 2.83 2.83 5.67-5.66"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <>{label && <>{label}</>}</>
      </label>
    </div>
  );
};
