import React, {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  Ref,
  ReactElement,
} from "react";
import { InputType } from "./type";
import { twMerge } from "tailwind-merge";
import { FormikValues } from "formik/dist/types";
import { Fab } from "@kit/fab";
import { IcEye, IcEyeSlash } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { getIn } from "formik";
import { useFormikProps } from "@utils/form-handler/provider";

const p2e = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)?.toString());
const a2e = (s: string) =>
  s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)?.toString());

const FRefInput = <FORMIK_VALUES extends FormikValues>(
  props: InputType<FORMIK_VALUES>,
  ref: Ref<HTMLInputElement>,
) => {
  const {
    formik,
    type,
    passwordHandler,
    endNode,
    startNode,
    className,
    label,
    helper,
    onChange,
    ...data
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleFocusOnInput = () => {
    inputRef.current?.focus();
  };
  useImperativeHandle(
    ref,
    // @ts-ignore
    () => {
      return {
        focus() {
          inputRef.current?.focus();
        },
        blur() {
          inputRef.current?.blur();
        },
      };
    },
    [],
  );

  const [passwordVisible, setPasswordVisible] = useState(false);

  const value = useMemo(() => {
    if (type == "file") return;
    return {
      value: formik?.values?.[data.name ?? ""],
    };
  }, [type, data.name, formik?.values]);

  const { validationSchema } = useFormikProps();

  const [fileName, setFileName] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFileName(selectedFile ? selectedFile.name : "");
    if (formik) {
      formik.setFieldValue(data.name ?? "", selectedFile);
    }
    // Call the onChange prop if provided, passing the event
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <div className="flex flex-col gap-[8px]">
      {label && (
        <p className={"text-[13px] font-bold"}>
          {(validationSchema as any)?.["fields"]?.[props.name ?? ""]?.[
            "exclusiveTests"
          ]?.["required"] !== undefined ||
          props?.validations?.some((item: any) => item.type === "required") ? (
            <>{label}*</>
          ) : (
            label
          )}
        </p>
      )}
      <div className={"flex flex-col gap-[4px]"}>
        <div
          onClick={handleFocusOnInput}
          className={twMerge(
            "input-wrapper flex items-center gap-[6px]",
            className,
          )}
        >
          {formik ? (
            <>
              {type === "file" ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <input
                    {...data}
                    {...value}
                    type="file"
                    ref={inputRef}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    id={data.id || data.name}
                  />
                  <label
                    htmlFor={data.id || data.name}
                    className="flex cursor-pointer flex-row items-center justify-between gap-2 text-[14px]"
                  >
                    <span className="rounded bg-primary-light bg-opacity-20 px-3 text-primary">
                      انتخاب فایل
                    </span>
                    <span className="text-typography-gray">{fileName}</span>
                  </label>
                </div>
              ) : (
                <input
                  {...data}
                  {...value}
                  onBlur={formik?.handleBlur}
                  type={passwordVisible && type === "password" ? "text" : type}
                  ref={inputRef}
                  onChange={(event) => {
                    formik?.setFieldValue(
                      data.name ?? "",
                      type === "file"
                        ? event.target.files?.[0]
                        : p2e(a2e(event.target.value)),
                    );
                    onChange?.(event);
                  }}
                />
              )}
            </>
          ) : (
            <input
              ref={inputRef}
              {...data}
              onChange={(event) => {
                onChange?.({
                  ...event,
                  target: {
                    ...event.target,
                    value: p2e(a2e(event.target.value)),
                  },
                });
              }}
            />
          )}
          {/* {formik ? (
          <input
            {...data}
            {...value}
            type={passwordVisible && type === "password" ? "text" : type}
            ref={inputRef}
            onChange={(event) => {
              formik?.setFieldValue(
                data.name ?? "",
                type == "file" ? event.target.files?.[0] : event.target.value,
              );
            }}
          />
        ) : (
          <input ref={inputRef} {...data} />
        )} */}
          {endNode && <>{endNode}</>}
          {passwordHandler && (
            <Fab
              variant={"outline"}
              color={"secondary-light"}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setPasswordVisible((prevState) => !prevState);
              }}
              size={"tiny"}
              type="button"
            >
              {passwordVisible ? (
                <SvgIcon
                  strokeColor={"secondary"}
                  className={"[&_svg]:h-[12px] [&_svg]:w-[12px]"}
                >
                  <IcEye />
                </SvgIcon>
              ) : (
                <SvgIcon
                  strokeColor={"secondary"}
                  className={"[&_svg]:h-[12px] [&_svg]:w-[12px]"}
                >
                  <IcEyeSlash />
                </SvgIcon>
              )}
            </Fab>
          )}
        </div>
        {formik && (
          <>
            {getIn(formik?.touched, String(data.name)) ? (
              Boolean(getIn(formik?.errors, String(data.name))) && (
                <span className={"text-[11px] text-error"}>
                  {getIn(formik?.touched, String(data.name)) &&
                    getIn(formik?.errors, String(data.name))}
                </span>
              )
            ) : (
              <span className={"text-[11px]"}>{helper}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Cast the output
export const Input = React.forwardRef(FRefInput) as <
  FORMIK_VALUES extends FormikValues,
>(
  props: InputType<FORMIK_VALUES> & { ref?: Ref<HTMLInputElement> },
) => ReactElement;
