import { Popup } from "@kit/popup";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectType } from "@kit/select/type";
import { Input } from "@kit/input";
import { Card } from "@kit/card";
import { IcClose } from "@feature/kits/common/icons";
import { Fab } from "@kit/fab";
import { useFormikProps } from "@utils/form-handler/provider";
import { getIn } from "formik";
import { SvgIcon } from "@kit/svg-icon";
import { Button } from "@kit/button";

export const Select = <TYPE extends { value: string | undefined }>(
  props: SelectType<TYPE>,
) => {
  const {
    options,
    searchOn,
    resettable,
    holder,
    multiple,
    formik,
    typeOfValue,
    name,
    children,
    label,
    onItemChange,
    defaultValue,
    ...data
  } = props;

  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<string>("");
  const [activeValue, setActiveValue] =
    useState<typeof typeOfValue>(defaultValue);
  const { validationSchema } = useFormikProps();
  const handleItemClick = (listItem: TYPE | undefined) => (event: any) => {
    event.preventDefault();
    !multiple && setOpen(false);
    handleSelectItem(listItem);
  };

  const filterList = useMemo(() => {
    if (!searchOn) return options;
    if (!filterValue) return options;
    // return options.filter((value) => {
    //   return (value?.[searchOn] as unknown as string)?.includes(filterValue);
    // });
    return options.filter((value) => {
      const itemValue = (value?.[searchOn] as unknown as string)?.toLowerCase();
      const searchValue = filterValue.toLowerCase();
      return itemValue.includes(searchValue);
    });
  }, [filterValue, options, searchOn]);

  const formikValue = useMemo(() => {
    if (!name) return undefined;
    const data = formik?.values?.[name];
    if (multiple) return data as Array<string>;
    return data as string;
  }, [formik?.values, multiple, name]);

  const activeItem = useMemo(() => {
    if (multiple) {
      const data = options.filter((listItem) =>
        formikValue?.includes(listItem?.value ?? ""),
      );
      if (data.length == 0) {
        // return activeValue as typeof typeOfValue;
        return data;
      } else {
        return data;
      }
    } else {
      return (
        options.find((listItem) => listItem?.value === formikValue) ??
        (activeValue as typeof typeOfValue)
      );
    }
  }, [options, multiple, activeValue, formikValue]);

  useEffect(() => {
    if (multiple) {
      onItemChange?.(activeItem as typeof typeOfValue);
    } else {
      onItemChange?.(activeItem as typeof typeOfValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, multiple]);

  const handleSelectItem = (item: TYPE | undefined) => {
    if (multiple) {
      handleOnChangeMultipleItem(item);
    } else {
      setActiveValue(item);
    }
    if (!name) return;
    if (multiple) {
      handleOnChangeFormikOfMultipleItem(name, item);
    } else {
      formik?.setFieldValue(name, item?.value);
    }
  };

  const reset = () => {
    handleSelectItem(undefined);
  };
  // reset local state when formik's values change
  useEffect(() => {
    setActiveValue(defaultValue);
  }, [formik?.values, defaultValue]);

  const holderRef = useRef<HTMLDivElement | null>(null);

  const handleOnChangeMultipleItem = (item: TYPE | undefined) => {
    if (!multiple) return;
    if (!item) {
      setActiveValue([]);
      return;
    }
    setActiveValue((prevState) => {
      const prevData = (prevState as typeof typeOfValue) ?? [];
      const dataExist = prevData?.find(
        (prevDataItem) => prevDataItem?.value == item.value,
      );
      if (dataExist) {
        return prevData?.filter(
          (prevDataItem) => prevDataItem?.value != item?.value,
        );
      }
      return [...prevData, item];
    });
  };

  const handleOnChangeFormikOfMultipleItem = (
    name: string,
    item: TYPE | undefined,
  ) => {
    if (!multiple) return;
    const prevData = (formik?.values?.[name] as Array<string>) ?? [];
    const dataExist = prevData?.find(
      (prevDataItem) => prevDataItem == item?.value,
    );
    if (dataExist) {
      formik?.setFieldValue(
        name,
        prevData?.filter((prevDataItem) => prevDataItem != item?.value),
      );
    } else {
      formik?.setFieldValue(name, [...prevData, item?.value]);
    }
  };

  const deleteItem = (item: TYPE | undefined) => {
    // it only uses in multiple select
    handleOnChangeMultipleItem(item);
    if (!name) return;
    handleOnChangeFormikOfMultipleItem(name, item);
  };

  return (
    <div className="flex flex-col">
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
      <>
        <Popup
          keepOpen={multiple}
          onChange={(open) => {
            setOpen(open);
          }}
          open={open}
          holder={
            <div className={"flex w-full items-center gap-2"} ref={holderRef}>
              {multiple && (
                <>
                  {holder(activeItem as typeof typeOfValue, reset, deleteItem)}
                </>
              )}
              {!multiple && (
                <>
                  {holder(activeItem as typeof typeOfValue, reset, deleteItem)}
                </>
              )}
              {resettable && (
                <Button
                  className="mt-2 border border-background-paper-dark px-3 py-[13px]"
                  color="paper"
                  variant={"outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    reset();
                  }}
                >
                  <SvgIcon
                    fillColor={"black"}
                    className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
                  >
                    <IcClose />
                  </SvgIcon>
                </Button>
              )}
            </div>
          }
        >
          <Card
            variant={"outline"}
            className={"mt-1 p-2"}
            style={{
              width: holderRef.current?.getBoundingClientRect().width + "px",
            }}
          >
            {searchOn ? (
              <Input
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                {...data}
                onChange={(event) => setFilterValue(event.target.value)}
                value={filterValue}
              />
            ) : (
              <></>
            )}
            <Card
              className={"flex max-h-[200px] flex-col gap-1 overflow-auto py-1"}
            >
              <>
                {React.Children.toArray(
                  filterList.map((listItem) => (
                    <>
                      {multiple &&
                        React.cloneElement(
                          children(listItem, activeItem as typeof typeOfValue),
                          {
                            onClick: handleItemClick(listItem),
                          },
                        )}
                      {!multiple &&
                        React.cloneElement(
                          children(listItem, activeItem as typeof typeOfValue),
                          {
                            onClick: handleItemClick(listItem),
                          },
                        )}
                    </>
                  )),
                )}
              </>
            </Card>
          </Card>
        </Popup>
        {formik && (
          <>
            {getIn(formik?.touched, String(name)) &&
              Boolean(getIn(formik?.errors, String(name))) && (
                <span className={"mt-1 text-[11px] text-error"}>
                  {getIn(formik?.touched, String(name)) &&
                    getIn(formik?.errors, String(name))}
                </span>
              )}
          </>
        )}
      </>
    </div>
  );
};
