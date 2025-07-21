import React from "react";
import { Button } from "@kit/button";
import { FBButtonElementType } from "@module/form-builder/type/sample/button";

interface FBInputProps {
  properties: FBButtonElementType;
}

export const FBButton = (props: FBInputProps) => {
  const { properties } = props;
  const { label, ...rest } = properties;

  return (
    <Button {...rest}>
      <span>{label}</span>
    </Button>
  );
};
