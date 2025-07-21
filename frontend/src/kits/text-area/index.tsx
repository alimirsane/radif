import React, { useEffect, useMemo, useRef } from "react";
import { TextAreaType } from "./type";
import { twMerge } from "tailwind-merge";
import { FormikValues } from "formik";
import { useFormikProps } from "@utils/form-handler/provider";

export const TextArea = <FORMIK_VALUES extends FormikValues>(
  props: TextAreaType<FORMIK_VALUES>,
) => {
  const { formik, className, label, onChange, rows = 3, ...data } = props;
  const { validationSchema } = useFormikProps();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleFocusOnTextArea = () => {
    textAreaRef.current?.focus();
  };

  const value = useMemo(() => {
    return {
      value: formik?.values?.[data.name ?? ""],
    };
  }, [data.name, formik?.values]);
  return (
    <div className="flex flex-col gap-[8px]">
      {label && (
        <span className={"text-[13px] font-bold"}>
          {(validationSchema as any)?.["fields"]?.[props.name ?? ""]?.[
            "exclusiveTests"
          ]?.["required"] !== undefined ||
          props?.validations?.some((item: any) => item.type === "required")
            ? `${label}*`
            : label}
        </span>
      )}
      <div
        onClick={handleFocusOnTextArea}
        className={twMerge(
          "textarea-wrapper flex items-center gap-[6px] text-[14px]",
          className,
        )}
      >
        {formik ? (
          <textarea
            {...data}
            {...value}
            ref={textAreaRef}
            rows={rows}
            onChange={(event) => {
              onChange?.(event);
              formik?.setFieldValue(data.name ?? "", event.target.value);
            }}
          />
        ) : (
          <textarea
            {...data}
            ref={textAreaRef}
            rows={rows}
            onChange={(event) => {
              onChange?.(event);
            }}
          />
        )}
      </div>
      {formik && (
        <>
          {formik?.errors?.[data.name ?? ""] && (
            <span className={"text-xs text-error"}>
              {formik?.errors?.[data.name ?? ""] as string}
            </span>
          )}
        </>
      )}
    </div>
  );
};
