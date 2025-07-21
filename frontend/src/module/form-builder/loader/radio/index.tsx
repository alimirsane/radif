import React from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import { RadioButton } from "@kit/radio";
import { FBRadioElementType } from "@module/form-builder/type/sample/radio";
import { RadioGroup } from "@kit/radio/group";

interface FBRadioProps {
  formik: FormikProps<FormikValues>;
  properties: FBRadioElementType;
}

export const FBRadio = (props: FBRadioProps) => {
  const { formik, properties } = props;

  return (
    <div className="flex flex-row flex-wrap gap-3 py-1">
      {properties.label && (
        <span className="text-[14px] font-bold">
          {properties?.validations &&
          properties?.validations.some((item: any) => item.type === "required")
            ? `${properties.label}*`
            : properties.label}
        </span>
      )}
      <RadioGroup formik={formik} name={properties.name}>
        <div className={"flex flex-row flex-wrap gap-3"}>
          {React.Children.toArray(
            properties.items.map((item) => (
              <RadioButton formik={formik} {...properties} value={item.value}>
                {item.label}
              </RadioButton>
            )),
          )}
        </div>
      </RadioGroup>
    </div>
  );
};
