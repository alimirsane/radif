import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { useDebounce } from "@utils/use-debounce";
import {
  IcAddDocument,
  IcCalendar,
  IcChevronDown,
  IcSearch,
} from "@feature/kits/common/icons";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";
import { ExperimentType } from "@api/service/experiment/type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { ActionDelete } from "@feature/dashboard/operator/laboratory/common/actions/delete";
import { ActionEdit } from "@feature/dashboard/operator/laboratory/common/actions/edit";
import { ActionView } from "@feature/dashboard/operator/laboratory/common/actions/view";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { Select } from "@kit/select";
import Tooltip from "@kit/tooltip";

const ExperimentsList = ({
  experimentsList,
}: {
  experimentsList: ExperimentType[] | undefined;
}) => {
  const router = useRouter();
  const [initialSearchList, setInitialSearchList] = useState<any[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  // set experiment search value
  const { value, setValue, debouncedValue } = useDebounce("");
  const openModal = useModalHandler((state) => state.openModal);
  useEffect(() => {
    if (debouncedValue) {
      router.query.search_experiment = debouncedValue;
      router.push(router);
    } else {
      delete router.query.search_experiment;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  // get current step id
  const { stepId, setStepId, nextStep, prevStep } =
    useOperatorLabManagementStepHandler();
  // add new experiment button
  const addNewExperiment = () => {
    router.query.experiment = "new";
    router.push(router);
  };
  // Set the initial experiments list only on first render
  useEffect(() => {
    if (isFirstRender && experimentsList) {
      const initialList = experimentsList?.map(({ id, name }) => ({
        value: id?.toString(),
        name,
      }));
      setInitialSearchList(initialList.reverse());
      setIsFirstRender(false);
    }
  }, [experimentsList, isFirstRender]);
  return (
    <AccessLevel module={"experiment"} permission={["view"]}>
      <>
        <AccessLevel module={"experiment"} permission={["create"]}>
          <div className="mb-8 flex w-full flex-col items-center md:flex-row">
            <div className="w-full md:w-2/5">
              {/* <Input
                placeholder="نام آزمون یا آزمایشگاه را وارد کنید"
                label="جستجوی آزمون"
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
                    delete router.query.search_experiment;
                    router.push(router);
                  }
                }}
                className="w-full"
                resettable
                label={"جستجوی آزمون"}
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
                      {activeItem?.name ?? "نام آزمون را انتخاب کنید"}
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
                startIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
                  >
                    <IcAddDocument />
                  </SvgIcon>
                }
                onClick={addNewExperiment}
              >
                اضافه کردن آزمون
              </Button>
            </div>
          </div>
        </AccessLevel>
        {experimentsList?.length === 0 && (
          <Card color="info" className="w-full p-7 text-center text-[14px]">
            <p>آزمونی یافت نشد.</p>
          </Card>
        )}
        {experimentsList?.length !== 0 && (
          <>
            <div className="mb-2 hidden w-full rounded-[10px] bg-background-paper-dark p-7 font-bold md:flex">
              <span className="w-[25%]">نام آزمون</span>
              <span className="w-[25%]">نام آزمایشگاه</span>
              <span className="w-[25%]">نام دستگاه</span>
              <span className="w-[13%]">وضعیت</span>
              <span className="w-[12%]">اقدامات</span>
            </div>
            {experimentsList?.toReversed().map((experiment, index) => (
              <Card
                key={index}
                color={index % 2 === 0 ? "paper" : "white"}
                variant={index % 2 === 0 ? "flat" : "outline"}
                className="mb-2 flex w-full flex-wrap items-center justify-between gap-4 rounded-[10px] px-7 py-6 text-[14px] md:gap-0"
              >
                <span className="w-full md:w-[25%]">
                  <span className="font-bold md:hidden">آزمون:</span>{" "}
                  {experiment.name}
                </span>
                <span className="w-full md:w-[25%]">
                  <span className="font-bold md:hidden">آزمایشگاه:</span>{" "}
                  {experiment.lab_name ?? ""}
                </span>
                <span className="w-full md:w-[25%]">
                  <span className="font-bold md:hidden">دستگاه:</span>{" "}
                  {experiment.device_obj?.name ?? "---"}
                </span>
                <span className="w-full md:w-[13%]">
                  <span className="font-bold md:hidden">وضعیت:</span>{" "}
                  <span
                    className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${experiment.status === "active" ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
                  >
                    {experiment.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </span>
                <span className="flex w-full justify-end gap-2 md:w-[12%] md:justify-normal">
                  <AccessLevel module={"experiment"} permission={["view"]}>
                    <ActionView
                      item={experiment}
                      modalKey={ModalKeys.OPERATOR_VIEW_EXPERIMENT}
                    />
                  </AccessLevel>
                  <AccessLevel module={"experiment"} permission={["update"]}>
                    <ActionEdit
                      item={experiment}
                      modalKey={ModalKeys.OPERATOR_EDIT_EXPERIMENT}
                    />
                  </AccessLevel>
                  <AccessLevel module={"experiment"} permission={["delete"]}>
                    <ActionDelete
                      item={experiment}
                      modalKey={ModalKeys.OPERATOR_DELETE_EXPERIMENT}
                    />
                  </AccessLevel>
                  <AccessLevel module={"experiment"} permission={["update"]}>
                    <Tooltip message="نوبت دهی">
                      <SvgIcon
                        onClick={() => {
                          if (!experiment.need_turn) return;
                          router.query.experiment = "appointment";
                          router.query.name =
                            experiment.id + "$" + experiment.name;
                          router.push(router);
                          // openModal(
                          //   ModalKeys.OPERATOR_SET_APPOINTMENT,
                          //   experiment.id,
                          // );
                        }}
                        fillColor={"primary"}
                        className={`${
                          !experiment.need_turn
                            ? "cursor-not-allowed opacity-45"
                            : "cursor-pointer"
                        } mx-1 [&_svg]:h-[20px] [&_svg]:w-[20px]`}
                      >
                        <IcCalendar />
                      </SvgIcon>
                    </Tooltip>
                  </AccessLevel>
                </span>
              </Card>
            ))}
          </>
        )}
        {/* <Button
        variant="solid"
        color="primary"
        className="mt-8 w-full md:w-auto"
        onClick={goToNextStep}
        startIcon={
          <SvgIcon
            fillColor={"white"}
            className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
          >
            <IcCheck />
          </SvgIcon>
        }
      >
        ثبت آزمون‌ها
      </Button> */}
      </>
    </AccessLevel>
  );
};

export default ExperimentsList;
