import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { useDebounce } from "@utils/use-debounce";
import { IcChevronDown, IcSearch } from "@feature/kits/common/icons";

const Search = () => {
  const router = useRouter();
  const searchTypesList = useMemo(() => {
    return [
      { value: "owner_national_id", name: "کد ملی مشتری" },
      { value: "owner_fullname", name: "نام مشتری" },
      // { value: "experiment_name", name: "نام آزمون" },
      { value: "request_number", name: "شماره درخواست" },
    ];
  }, []);
  const [searchType, setSearchType] = useState(searchTypesList[0]);

  const { value, setValue, debouncedValue } = useDebounce("");
  useEffect(() => {
    if (debouncedValue) {
      router.query[searchType.value] = debouncedValue;
      router.push(router);
    } else {
      delete router.query["request_number"];
      // delete router.query["experiment_name"];
      delete router.query["owner_fullname"];
      delete router.query["owner_national_id"];
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, searchType]);

  useEffect(() => {
    setValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType.value]);

  return (
    <div id="print-hidden" className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Select
        options={searchTypesList}
        label={"جستجو براساس"}
        defaultValue={searchType}
        onItemChange={(e) => {
          if (!e) return;
          setSearchType(e);
        }}
        holder={(activeItem) => (
          <Card
            variant={"outline"}
            className={
              " mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
            }
          >
            <span
              className={
                activeItem
                  ? "text-typography-main"
                  : "text-[13px] text-typography-secondary"
              }
            >
              {activeItem?.name ?? "انتخاب کنید"}
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
      <Input
        label={searchType.name}
        placeholder={`${searchType.name === "شماره درخواست" ? "شماره درخواست را به طور کامل" : searchType.name + " را"} برای جستجو وارد کنید`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (router.query.hasOwnProperty("request_id")) {
            delete router.query.request_id;
            router.push(router);
          }
        }}
        endNode={
          <SvgIcon
            className={
              "cursor-pointer [&>svg]:h-[15px] [&>svg]:w-[15px] [&_path]:fill-typography-gray"
            }
          >
            <IcSearch />
          </SvgIcon>
        }
      />
    </div>
  );
};

export default Search;
