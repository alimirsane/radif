import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { Select } from "@kit/select";
import React from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { FBSelectElementType } from "@module/form-builder/type/sample/select";
import { SvgIcon } from "@kit/svg-icon";
import { IcChevronDown } from "@feature/kits/common/icons";

interface FBSelectProps {
  formik: FormikProps<FormikValues>;
  properties: FBSelectElementType;
}

export const FBSelect = (props: FBSelectProps) => {
  const { formik, properties } = props;

  return (
    <Select<{ value: string; label: string }>
      formik={formik}
      holder={(activeItem, reset) => (
        <Card
          variant={"outline"}
          className="mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
        >
          <span
            className={
              activeItem?.value === undefined
                ? "text-[14px] text-typography-secondary"
                : "text-[14px] text-typography-main"
            }
          >
            {activeItem?.label ?? properties.hint}
          </span>
          <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
            <IcChevronDown />
          </SvgIcon>
        </Card>
      )}
      {...properties}
    >
      {(item, activeItem) => (
        <Button
          className={"w-full"}
          variant={activeItem?.value === item?.value ? "solid" : "text"}
          color={activeItem?.value === item?.value ? "info" : "black"}
        >
          {item?.label}
        </Button>
      )}
    </Select>
  );
};
