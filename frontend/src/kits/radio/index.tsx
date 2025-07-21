import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FormikValues } from "formik/dist/types";
import { RadioButtonTypes } from "./type";

export const RadioButton = <FORMIK_VALUES extends FormikValues>(
  props: RadioButtonTypes<FORMIK_VALUES>,
) => {
  const { formik, name, children, value, onChange } = props;

  const [isChecked, setIsChecked] = useState(false);

  const handleRadiobuttonChange = () => {
    if (isChecked) return;
    if (name) {
      formik?.setFieldValue(name, value);
    }
    onChange?.(true);
  };
  useEffect(() => {
    setIsChecked(formik?.values?.[name ?? ""] === value);
  }, [formik?.values, value, name]);
  return (
    <>
      <label className="flex cursor-pointer select-none items-center gap-1">
        <div className="relative transition-all ">
          <input
            name={name}
            type="radio"
            value={value}
            checked={isChecked}
            className="sr-only"
            onClick={handleRadiobuttonChange}
          />
          <div
            className={twMerge(
              "block h-6 w-6 rounded-full border-[2px] border-primary",
              isChecked ? "border-primary" : "border-background-paper-dark",
            )}
          />
          {isChecked && (
            <div
              className="dot absolute h-3 w-3 rounded-full bg-primary transition-all duration-500"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          )}
        </div>
        {children}
      </label>
    </>
  );
};
