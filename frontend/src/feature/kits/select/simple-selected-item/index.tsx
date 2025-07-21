import { Select } from "@kit/select";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import React from "react";

export const SimpleSelectedItemSelectLayout = () => {
  return (
    <Select
      options={[
        { value: "1", anotherCustomName: "نام فیلد اول" },
        { value: "2", anotherCustomName: "نام فیلد دوم" },
        { value: "3", anotherCustomName: "نام فیلد سوم" },
      ]}
      holder={(activeItem) => (
        <Card
          variant={"outline"}
          className={
            "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
          }
        >
          <span
            className={
              activeItem?.anotherCustomName === undefined
                ? "text-typography-secondary"
                : "text-typography-main"
            }
          >
            {activeItem?.anotherCustomName ??
              "سلکت ساده با قابلیت مشخص بودن آیتم انتخاب شده"}
          </span>
        </Card>
      )}
    >
      {(item, activeItem) => (
        <Button
          className={"w-full"}
          variant={item?.value === activeItem?.value ? "solid" : "text"}
          color={"info"}
        >
          {item?.anotherCustomName}
        </Button>
      )}
    </Select>
  );
};
