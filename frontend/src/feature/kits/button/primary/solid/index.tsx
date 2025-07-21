import React from "react";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { Icon } from "@feature/kits/common/icons";

export const ButtonPrimarySolidLayout = () => {
  return (
    <div className={"flex flex-row gap-1"}>
      <Button
        variant="solid"
        color="primary"
        endIcon={
          <SvgIcon
            fillColor={"paper"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      >
        تایید
      </Button>

      <Button
        variant="solid"
        color="primary"
        startIcon={
          <SvgIcon
            fillColor={"paper"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      >
        تایید
      </Button>

      <Button variant="solid" color="primary">
        تایید
      </Button>

      <Button variant="solid" color="primary" className="w-full">
        تایید
      </Button>
    </div>
  );
};
