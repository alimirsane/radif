import { twMerge } from "tailwind-merge";
import { SwitchTypes } from "@kit/switch/type";
import { FormikValues } from "formik/dist/types";
import { useMemo } from "react";

export const Switch = <FORMIK_VALUES extends FormikValues>(
  props: SwitchTypes<FORMIK_VALUES> & {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (isChecked: boolean) => void;
  },
) => {
  const { formik, name, children, checked, onChange, disabled } = props;

  const isCheck = useMemo(() => {
    if (formik && name) return formik.values?.[name] ?? checked;
    return checked;
  }, [checked, formik, name]);

  const handleCheckboxChange = () => {
    const newCheckedState = !isCheck;
    if (formik && name) {
      formik.setFieldValue(name, newCheckedState);
    }
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <>
      <label className="flex cursor-pointer select-none items-center gap-1">
        <div className="relative transition-all">
          <input
            type="checkbox"
            checked={isCheck}
            onChange={handleCheckboxChange}
            className="sr-only"
            disabled={disabled}
          />
          <div
            className={twMerge(
              "block h-7 w-12 rounded-full bg-primary",
              isCheck ? "bg-primary" : "bg-typography-secondary",
            )}
          />
          <div
            className={twMerge(
              "dot absolute left-1 top-1 h-5 w-5 rounded-full bg-background-default transition-all duration-500",
              isCheck ? "translate-x-full" : "",
            )}
          ></div>
        </div>
        {children}
      </label>
    </>
  );
};
