import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useMemo } from "react";
import { IcChevronDown } from "@feature/kits/common/icons";
import { month, week } from "./data";

const Filter = () => {
  const monthData = useMemo(() => {
    return [...month];
  }, []);
  const weekData = useMemo(() => {
    return [...week];
  }, []);
  return (
    <div className="mt-[32px]  flex w-full items-end justify-between ">
      <div className="flex w-3/5 gap-[40px]">
        <div className="w-1/2">
          <Input
            label="جستجو"
            placeholder="کدرهگیری یا نمونه یا عبارتی که می‌خواهید را جستجو کنید"
            className="w-full"
          />
        </div>
        <div className="grid w-1/3 grid-cols-2 gap-[32px]">
          <Select
            options={monthData}
            name={"month"}
            label={"ماه"}
            className="w-1/2 gap-0"
            holder={(activeItem) => (
              <Card
                variant={"outline"}
                className={
                  "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                }
              >
                <span
                  className={
                    activeItem
                      ? "text-typography-main"
                      : "text-[13px] text-typography-secondary"
                  }
                >
                  {activeItem?.name ?? "ماه"}
                </span>

                <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                  <IcChevronDown />
                </SvgIcon>
              </Card>
            )}
          >
            {(item, activeItem) => (
              <Button
                className={"w-full"}
                variant={item?.value === activeItem?.value ? "solid" : "text"}
                color={"primary"}
              >
                {item?.name}
              </Button>
            )}
          </Select>
          <Select
            options={monthData}
            name={"week"}
            label={"هفته"}
            className="w-1/2 gap-0"
            holder={(activeItem) => (
              <Card
                variant={"outline"}
                className={
                  "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                }
              >
                <span
                  className={
                    activeItem
                      ? "text-typography-main"
                      : "text-[13px] text-typography-secondary"
                  }
                >
                  {activeItem?.name ?? "هفته "}
                </span>

                <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                  <IcChevronDown />
                </SvgIcon>
              </Card>
            )}
          >
            {(item, activeItem) => (
              <Button
                className={"w-full"}
                variant={item?.value === activeItem?.value ? "solid" : "text"}
                color={"primary"}
              >
                {item?.name}
              </Button>
            )}
          </Select>
        </div>
      </div>
      <Button variant="outline">امروز</Button>
    </div>
  );
};

export default Filter;
