import React from "react";
import { Input } from "@kit/input";
import { SvgIcon } from "@kit/svg-icon";
import { IcSearch, Icon } from "@feature/kits/common/icons";
import { useDebounce } from "@utils/use-debounce";
import { useEffect } from "react";
import Router from "next/router";

const Filter = () => {
  const { value, setValue, debouncedValue } = useDebounce("");
  useEffect(() => {
    if (debouncedValue) {
      Router.query.search_request = debouncedValue;
      Router.push(Router);
    } else {
      delete Router.query.search_request;
      Router.push(Router);
    }
  }, [debouncedValue]);
  return (
    <div
      className="
        flex w-full flex-col gap-[16px]
        md:grid
        md:grid-cols-2
        md:gap-[16px]
        lg:flex
        lg:justify-between
        "
    >
      <div className="w-full lg:w-4/12">
        <Input
          placeholder="کد پیگیری، نام آزمون یا شماره درخواست را جستجو کنید"
          label="جستجوی درخواست"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
      <div className="w-full lg:w-4/12">{/* dropdown */}</div>
    </div>
  );
};

export default Filter;
