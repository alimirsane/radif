import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { useDebounce } from "@utils/use-debounce";
import {
  IcAddDocument,
  IcChevronDown,
  IcSearch,
} from "@feature/kits/common/icons";
import { DeviceType } from "@api/service/device/type";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";
import { ModalKeys } from "@utils/modal-handler/config";
import { ActionView } from "@feature/dashboard/operator/laboratory/common/actions/view";
import { ActionEdit } from "@feature/dashboard/operator/laboratory/common/actions/edit";
import { ActionDelete } from "@feature/dashboard/operator/laboratory/common/actions/delete";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { Select } from "@kit/select";

const DevicesList = ({
  devicesList,
}: {
  devicesList: DeviceType[] | undefined;
}) => {
  const router = useRouter();
  const [initialSearchList, setInitialSearchList] = useState<any[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  // set device search value
  const { value, setValue, debouncedValue } = useDebounce("");
  useEffect(() => {
    if (debouncedValue) {
      router.query.search_device = debouncedValue;
      router.push(router);
    } else {
      delete router.query.search_device;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  // get current step id
  const { stepId, setStepId, nextStep, prevStep } =
    useOperatorLabManagementStepHandler();
  // add new device button
  const addNewDevice = () => {
    router.query.device = "new";
    router.push(router);
  };
  // Set the initial devices list only on first render
  useEffect(() => {
    if (isFirstRender && devicesList) {
      const initialList = devicesList?.map(({ id, name }) => ({
        value: id?.toString(),
        name,
      }));
      setInitialSearchList(initialList.reverse());
      setIsFirstRender(false);
    }
  }, [devicesList, isFirstRender]);
  return (
    <AccessLevel module={"device"} permission={["view"]}>
      <>
        <AccessLevel module={"device"} permission={["create"]}>
          <div className="mb-8 flex w-full flex-col items-center md:flex-row">
            <div className="w-full md:w-2/5">
              {/* <Input
                placeholder="نام دستگاه یا آزمایشگاه را وارد کنید"
                label="جستجوی دستگاه"
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
                    delete router.query.search_device;
                    router.push(router);
                  }
                }}
                className="w-full"
                resettable
                label={"جستجوی دستگاه"}
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
                      {activeItem?.name ?? "نام دستگاه را انتخاب کنید"}
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
                onClick={addNewDevice}
                startIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
                  >
                    <IcAddDocument />
                  </SvgIcon>
                }
              >
                اضافه کردن دستگاه
              </Button>
            </div>
          </div>
        </AccessLevel>
        {devicesList?.length === 0 && (
          <Card color="info" className="w-full p-7 text-center text-[14px]">
            <p>دستگاهی یافت نشد.</p>
          </Card>
        )}
        {devicesList?.length !== 0 && (
          <>
            <div className="mb-2 hidden w-full rounded-[10px] bg-background-paper-dark p-7 font-bold md:flex">
              <span className="w-[35%]">نام دستگاه</span>
              <span className="w-[35%]">نام آزمایشگاه</span>
              <span className="w-[18%]">وضعیت</span>
              <span className="w-[12%]">اقدامات</span>
            </div>
            {devicesList?.toReversed().map((device, index) => (
              <Card
                key={index}
                color={index % 2 === 0 ? "paper" : "white"}
                variant={index % 2 === 0 ? "flat" : "outline"}
                className="mb-2 flex w-full flex-wrap items-center justify-between gap-4 rounded-[10px] px-7 py-6 text-[14px] md:gap-0"
              >
                <span className="w-full md:w-[35%]">
                  <span className="font-bold md:hidden">دستگاه:</span>{" "}
                  {device.name}
                </span>
                <span className="w-full md:w-[35%]">
                  <span className="font-bold md:hidden">آزمایشگاه:</span>{" "}
                  {device.lab_name ?? ""}
                </span>
                <span className="w-full md:w-[18%]">
                  <span className="font-bold md:hidden">وضعیت:</span>{" "}
                  <span
                    className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${device.status === "active" ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
                  >
                    {device.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </span>
                <span className="flex w-full justify-end gap-2 md:w-[12%] md:justify-normal">
                  <AccessLevel module={"device"} permission={["view"]}>
                    <ActionView
                      item={device}
                      modalKey={ModalKeys.OPERATOR_DEVICE_DETAILS}
                    />
                  </AccessLevel>
                  <AccessLevel module={"device"} permission={["update"]}>
                    <ActionEdit
                      item={device}
                      modalKey={ModalKeys.OPERATOR_EDIT_DEVICE}
                    />
                  </AccessLevel>
                  <AccessLevel module={"device"} permission={["delete"]}>
                    <ActionDelete
                      item={device}
                      modalKey={ModalKeys.OPERATOR_DELETE_DEVICE}
                    />
                  </AccessLevel>
                </span>
              </Card>
            ))}
          </>
        )}
        {/* <Button
        variant="solid"
        color="primary"
        className="mt-8 w-full sm:w-auto"
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
        ثبت دستگاه‌ها
      </Button> */}
      </>
    </AccessLevel>
  );
};

export default DevicesList;
