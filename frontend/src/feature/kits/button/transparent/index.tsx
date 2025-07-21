import { Icon } from "@feature/kits/common/icons";
import React from "react";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";

export const ButtonTransparentLayout = () => {
  return (
    <div className={"flex flex-row gap-1"}>
      <Button
        variant="text"
        endIcon={
          <SvgIcon
            fillColor={"info"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      >
        تایید
      </Button>

      <Button
        variant="text"
        startIcon={
          <SvgIcon
            fillColor={"black"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      >
        تایید
      </Button>

      <Button variant="text">تایید</Button>

      <Button variant="text" className="w-full">
        تایید
      </Button>
    </div>
  );
};
