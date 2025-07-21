import { Icon } from "../../../common/icons";
import React from "react";
import { Button } from "../../../../../kits/button";
import { SvgIcon } from "@kit/svg-icon";

export const ButtonSecondarySolidLayout = () => {
  return (
    <div className={"flex flex-row gap-1"}>
      <Button
        variant="solid"
        color="secondary-light"
        endIcon={
          <SvgIcon
            fillColor={"secondary"}
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
        color="secondary-light"
        startIcon={
          <SvgIcon
            fillColor={"secondary"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      >
        تایید
      </Button>

      <Button variant="solid" color="secondary-light">
        تایید
      </Button>

      <Button variant="solid" color="secondary-light" className="w-full">
        تایید
      </Button>
    </div>
  );
};
