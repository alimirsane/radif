import React from "react";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { Icon } from "@feature/kits/common/icons";

export const ButtonPrimaryOutlineLayout = () => {
  return (
    <div className={"flex flex-row gap-1"}>
      <Button
        variant="outline"
        color="primary"
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
        variant="outline"
        color="primary"
        startIcon={
          <SvgIcon
            fillColor={"primary"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      >
        تایید
      </Button>

      <Button variant="outline" color="primary">
        تایید
      </Button>

      <Button variant="outline" color="primary" className="w-full">
        تایید
      </Button>
    </div>
  );
};
