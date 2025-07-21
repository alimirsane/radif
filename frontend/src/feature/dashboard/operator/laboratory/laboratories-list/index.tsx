import { useRouter } from "next/router";

import { LaboratoryType } from "@api/service/laboratory/type";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { useQueryClient } from "@tanstack/react-query";
import { apiLaboratory } from "@api/service/laboratory";
import { useEffect, useMemo, useState } from "react";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcAddDocument,
  IcChevronDown,
  IcSearch,
} from "@feature/kits/common/icons";
import { Input } from "@kit/input";
import { useDebounce } from "@utils/use-debounce";
import { ModalKeys } from "@utils/modal-handler/config";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import EditLab from "@feature/dashboard/operator/laboratory/laboratories-list/modal/lab-edit";
import { ActionEdit } from "@feature/dashboard/operator/laboratory/common/actions/edit";
import { ActionView } from "@feature/dashboard/operator/laboratory/common/actions/view";
import { Select } from "@kit/select";

const LaboratoriesList = ({
  laboratories,
}: {
  laboratories: LaboratoryType[] | undefined;
}) => {
  const router = useRouter();
  const [initialSearchList, setInitialSearchList] = useState<any[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  // set lab search value
  const { value, setValue, debouncedValue } = useDebounce("");
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
  // add new lab button
  const addNewLab = () => {
    router.query.lab = "new";
    router.replace(router);
  };

  // Set the initial laboratories list only on first render
  useEffect(() => {
    if (isFirstRender && laboratories) {
      const initialList = laboratories?.map(({ id, name }) => ({
        value: id?.toString(),
        name,
      }));
      setInitialSearchList(initialList.reverse());
      setIsFirstRender(false);
    }
  }, [laboratories, isFirstRender]);
  return (
    <AccessLevel module={"laboratory"} permission={["view"]}>
      <Card
        variant={"outline"}
        className="flex flex-col items-center border-2 border-info border-opacity-10 p-5 md:p-8"
      >
        <AccessLevel module={"laboratory"} permission={["create"]}>
          <div className="mb-8 flex w-full flex-col items-center md:flex-row">
            <div className="w-full md:w-2/5">
              {/* <Input
                placeholder="نام آزمایشگاه را وارد کنید"
                label="جستجوی آزمایشگاه"
                value={value}
                className="w-full"
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
              /> */}
              <Select
                options={initialSearchList ?? []}
                value={value}
                onItemChange={(activeItem) => {
                  if (activeItem) {
                    setValue(activeItem?.name ?? "");
                  } else {
                    delete router.query.search_lab;
                    router.push(router);
                  }
                }}
                className="w-full"
                resettable
                label={"جستجوی آزمایشگاه"}
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
                      {activeItem?.name ?? "نام آزمایشگاه را انتخاب کنید"}
                    </span>

                    <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                )}
                searchOn={"name"}
                placeholder="جستجو کنید"
              >
                {(item, activeItem) => (
                  <Button
                    className={"w-full"}
                    variant={
                      item?.value === activeItem?.value ? "solid" : "text"
                    }
                    color={"primary"}
                  >
                    {item?.name}
                  </Button>
                )}
              </Select>
            </div>
            <div className="mt-8 flex w-full justify-center md:mt-auto md:w-3/5 md:justify-end">
              <Button
                variant="solid"
                color="primary"
                onClick={() => {
                  addNewLab();
                }}
                startIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
                  >
                    <IcAddDocument />
                  </SvgIcon>
                }
              >
                اضافه کردن آزمایشگاه
              </Button>
            </div>
          </div>
        </AccessLevel>
        {laboratories?.length === 0 && (
          <Card color="info" className="w-full p-7 text-center text-[14px]">
            <p>آزمایشگاهی یافت نشد.</p>
          </Card>
        )}
        {laboratories?.length !== 0 && (
          <AccessLevel module={"laboratory"} permission={["view"]}>
            <>
              <div className="mb-2 hidden w-full rounded-[10px] bg-background-paper-dark p-7 font-bold md:flex">
                <span className="w-[25%]">نام آزمایشگاه</span>
                <span className="w-[30%]">اپراتور</span>
                <span className="w-[18%]">مدیر فنی</span>
                <span className="w-[15%]">وضعیت</span>
                <span className="flex w-[12%]">اقدامات</span>
              </div>
              {laboratories?.toReversed().map((lab, index) => (
                <Card
                  key={index}
                  color={index % 2 === 0 ? "paper" : "white"}
                  variant={index % 2 === 0 ? "flat" : "outline"}
                  className="mb-2 flex w-full flex-wrap items-center justify-between gap-4 rounded-[10px] px-7 py-6 text-[14px] md:gap-0"
                >
                  <span className="w-full md:w-[25%]">
                    <span className="font-bold md:hidden">آزمایشگاه:</span>{" "}
                    {lab.name}
                  </span>
                  <span className="w-full md:w-[30%]">
                    <span className="font-bold md:hidden">اپراتور:</span>{" "}
                    {/* {lab.operator_obj
                      ? lab.operator_obj.first_name +
                        " " +
                        lab.operator_obj.last_name
                      : !!lab.operators.length
                        ? lab.operators.join(", ")
                        : "---"} */}
                    {lab.operators_obj && lab.operators_obj.length > 0
                      ? lab.operators_obj
                          .map(
                            (operator) =>
                              operator.first_name + " " + operator.last_name,
                          )
                          .join("، ")
                      : "---"}
                  </span>
                  <span className="w-full md:w-[18%]">
                    <span className="font-bold md:hidden">مدیر فنی:</span>{" "}
                    {lab.technical_manager_obj
                      ? lab.technical_manager_obj?.first_name +
                        " " +
                        lab.technical_manager_obj?.last_name
                      : "---"}
                  </span>
                  <span className="w-full md:w-[15%]">
                    <span className="font-bold md:hidden">وضعیت:</span>{" "}
                    <span
                      className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${lab.status === "active" ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
                    >
                      {lab.status === "active" ? "فعال" : "غیرفعال"}
                    </span>
                  </span>
                  <span className="relative flex w-full flex-row items-center justify-end gap-2 md:w-[12%] md:justify-normal">
                    <AccessLevel module={"laboratory"} permission={["view"]}>
                      <ActionView
                        item={lab}
                        modalKey={ModalKeys.OPERATOR_LABORATORY_DETAILS}
                      />
                    </AccessLevel>
                    <AccessLevel module={"laboratory"} permission={["update"]}>
                      <ActionEdit
                        item={lab}
                        modalKey={ModalKeys.OPERATOR_EDIT_LAB}
                      />
                    </AccessLevel>
                  </span>
                </Card>
              ))}
            </>
          </AccessLevel>
        )}
      </Card>
    </AccessLevel>
  );
};

export default LaboratoriesList;
