import React from "react";
import { Input } from "@kit/input";
import { Icon } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Button } from "@kit/button";
import { TextArea } from "@kit/text-area";

export const InputOutlineLayout = () => {
  return (
    <>
      <Input placeholder="ورودی نوشتاری" />
      <Input placeholder="ورودی نوشتاری با عنوان" label={"نام"} />
      <Input
        placeholder="ورودی نوشتاری با عنوان و المنت سمت راست"
        label={"نام خانوادگی"}
      />
      <Input
        placeholder="ورودی نوشتاری با المنت سمت راست"
        startNode={
          <SvgIcon
            fillColor={"secondary"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      />
      <Input
        placeholder="ورودی نوشتاری با المنت سمت چپ"
        endNode={
          <SvgIcon
            fillColor={"secondary"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      />
      <Input
        placeholder="ورودی نوشتاری با المنت سمت چپ و راست"
        endNode={
          <Button variant={"outline"} size={"small"}>
            <span className={"text-[12px]"}>جستجو</span>
          </Button>
        }
        startNode={
          <SvgIcon
            fillColor={"secondary"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      />
      <Input
        className={"w-[300px]"}
        placeholder="ورودی نوشتاری عرض محدود"
        endNode={
          <SvgIcon
            fillColor={"secondary"}
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <Icon />
          </SvgIcon>
        }
      />
      <TextArea placeholder="متن" label="پیام" rows={6} />
    </>
  );
};
