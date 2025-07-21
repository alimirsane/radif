import React, { useEffect } from "react";
import { Select } from "@kit/select";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcChevronDown, IcSearch } from "@feature/kits/common/icons";
import { Input } from "@kit/input";
import { useDebounce } from "@utils/use-debounce";
import { useQuery } from "@tanstack/react-query";
import Router, { useRouter } from "next/router";
import { DepartmentType } from "@api/service/department/type";
import { apiLabDepartment } from "@api/service/lab-department";

const Filter = () => {
  const { value, setValue, debouncedValue } = useDebounce("");
  const { data: departments } = useQuery(apiLabDepartment().getAll());

  const router = useRouter();

  const collegeList = () => {
    if (departments?.data) {
      return departments.data?.map((department: DepartmentType) => {
        return { value: department.id.toString(), label: department.name };
      });
    } else {
      return [];
    }
  };
  useEffect(() => {
    if (debouncedValue) {
      router.query.search_lab = debouncedValue;
      router.push(router);
    } else {
      delete router.query.search_lab;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="mb-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-[32px]">
      <div className="mb-[12px] flex w-full flex-col gap-[8px] md:mb-[16px]">
        <Input
          className={" bg-common-white"}
          type={"text"}
          label={"جستجو"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={"نام آزمایشگاه یا آزمون را وارد کنید"}
          endNode={
            <SvgIcon
              className={
                "cursor-pointer [&_path]:fill-typography-gray [&_svg]:h-[15px] [&_svg]:w-[15px]"
              }
            >
              <IcSearch />
            </SvgIcon>
          }
        />
      </div>
      <div className="mb-[12px] flex w-full flex-col gap-[8px] md:mb-[16px]">
        <Select
          resettable
          options={collegeList()}
          label="دانشکده"
          onItemChange={(activeItem) => {
            if (activeItem) {
              Router.query.search_college = activeItem?.value;
              Router.push(Router);
            } else {
              delete Router.query.search_college;
              Router.push(Router);
            }
          }}
          holder={(activeItem) => (
            <Card
              variant={"outline"}
              className={
                "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
              }
            >
              <span
                className={
                  activeItem?.label === undefined
                    ? "text-[13px] text-typography-secondary"
                    : "text-[13px] text-typography-main"
                }
              >
                {activeItem?.label ?? "دانشکده مورد نظر را انتخاب کنید"}
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
              color={"info"}
            >
              {item?.label}
            </Button>
          )}
        </Select>
      </div>
    </div>
  );
};

export default Filter;
