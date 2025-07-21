import { Select } from "@kit/select";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import React from "react";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { SvgIcon } from "@kit/svg-icon";

export const MultipleSelectLayout = () => {
  return (
    <Select
      multiple
      onItemChange={(selectedItem) => {}}
      options={[
        { value: "1", name: "نام فیلد اول" },
        { value: "2", name: "نام فیلد دوم" },
        { value: "3", name: "نام فیلد سوم" },
      ]}
      holder={(activeItem, reset, deleteItem) => (
        <Card
          variant={"outline"}
          className={
            "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
          }
        >
          <span
            className={
              activeItem?.length === 0
                ? "text-typography-secondary"
                : "text-typography-main"
            }
          >
            {activeItem?.length == 0 ? (
              "سلکت چند انتخابی"
            ) : (
              <div className={"flex flex-row gap-1"}>
                {React?.Children?.toArray(
                  activeItem?.map((item) => (
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        deleteItem(item);
                      }}
                      endIcon={
                        <SvgIcon
                          className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                        >
                          <CloseIcon />
                        </SvgIcon>
                      }
                      size={"small"}
                      color={"info"}
                      variant={"outline"}
                    >
                      {item?.name}
                    </Button>
                  )),
                )}
              </div>
            )}
          </span>
        </Card>
      )}
    >
      {(item, activeItem) => (
        <Button
          className={"w-full"}
          variant={
            activeItem
              ?.map((activeIndexItem) => activeIndexItem?.value)
              ?.includes(item?.value)
              ? "solid"
              : "text"
          }
          color={"info"}
        >
          {item?.name}
        </Button>
      )}
    </Select>
  );
};
