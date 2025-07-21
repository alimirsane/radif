import React from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { Checkbox } from "@kit/checkbox";
import { FBCheckboxElementType } from "@module/form-builder/type/sample/checkbox";
import { CheckBoxGroup } from "@kit/checkbox/group";

interface FBCheckboxProps {
  formik: FormikProps<FormikValues>;
  properties: FBCheckboxElementType;
}

export const FBCheckbox = (props: FBCheckboxProps) => {
  const { formik, properties } = props;
  const handleCheckboxChange = (value: string) => {
    const currentValues = !properties.selectedValues?.includes(value)
      ? [...(properties.selectedValues ?? ""), value]
      : properties.selectedValues.filter((v: any) => v !== value);
    properties.selectedValues = [...currentValues];
  };
  return (
    <div className="flex flex-row flex-wrap gap-3 whitespace-nowrap py-1">
      {properties.label && (
        <span className="text-[14px] font-bold">
          {properties?.validations &&
          properties?.validations.some((item: any) => item.type === "required")
            ? `${properties.label}*`
            : properties.label}
        </span>
      )}
      <CheckBoxGroup formik={formik} name={properties.name}>
        <div className={"flex flex-row flex-wrap gap-3"}>
          {React.Children.toArray(
            properties.items.map((item) => (
              <Checkbox
                formik={formik}
                {...properties}
                label={item.label}
                defaultChecked={properties.selectedValues?.includes(
                  item.value ?? "",
                )}
                value={item.value}
                onChange={() => handleCheckboxChange(item.value ?? "")}
              />
            )),
          )}
        </div>
      </CheckBoxGroup>
    </div>
  );
};
