import { Select } from "@kit/select";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import React from "react";

export const SimpleSelectLayout = () => {
  return (
    <Select
      onItemChange={selectedItem => {
      }}
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
            {activeItem?.anotherCustomName ?? "سلکت ساده"}
          </span>
        </Card>
      )}
    >
      {(item, activeItem) => (
        <Button className={"w-full"} variant={"text"} color={"info"}>
          {item?.anotherCustomName}
        </Button>
      )}
    </Select>
  );
};
