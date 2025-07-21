import { Select } from "@kit/select";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import React from "react";

export const ResettableSelectLayout = () => {
  return (
    <div className={"w-96"}>
      <Select
        resettable
        options={[
          { value: "1", name: "آیتم اول" },
          { value: "2", name: "آیتم دوم" },
          { value: "3", name: "آیتم سوم" },
        ]}
        holder={(activeItem, reset) => (
          <Card
            variant={"outline"}
            className={
              "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
            }
          >
            <span
              className={
                activeItem?.name === undefined
                  ? "text-typography-secondary"
                  : "text-typography-main"
              }
            >
              {activeItem?.name ?? "سلکت با قابلیت حذف"}
            </span>
          </Card>
        )}
        searchOn={"name"}
        placeholder="جستجو کنید"
      >
        {(item, activeItem) => (
          <Button className={"w-full"} variant={"text"} color={"info"}>
            {item?.name}
          </Button>
        )}
      </Select>
    </div>
  );
};
