import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { apiParameter } from "@api/service/parameter";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";
import {
  IcAddDocument,
  IcChevronDown,
  IcSearch,
} from "@feature/kits/common/icons";
import { Input } from "@kit/input";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { ActionEdit } from "@feature/dashboard/operator/laboratory/common/actions/edit";
import { ActionDelete } from "@feature/dashboard/operator/laboratory/common/actions/delete";
import { ActionView } from "../common/actions/view";
import { Select } from "@kit/select";
import { useDebounce } from "@utils/use-debounce";

const ParameterInformation = () => {
  const router = useRouter();
  const [initialSearchList, setInitialSearchList] = useState<any[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey);
  };
  // get experiment id from state management
  const experimentId: number | undefined = useOperatorLabManagementStepHandler(
    (state) => state.experimentId,
  );
  // get parameters data
  const { data: parameters, isLoading: parametersLoading } = useQuery(
    apiParameter().getAll({
      search: router.query.search_parameter,
    }),
  );
  const { value, setValue, debouncedValue } = useDebounce("");
  // useEffect(() => {
  //   if (debouncedValue) {
  //     router.query.search_parameter = debouncedValue;
  //     router.push(router);
  //   } else {
  //     delete router.query.search_parameter;
  //     router.push(router);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [debouncedValue, value]);
  // useEffect(() => {
  //   //  set initial value for router query
  //   router.query.parametersCount = "0";
  //   router.push(router);
  // }, [experimentId]);
  // useEffect(() => {
  //   // get parameters based on router changes
  //   refetch();
  // }, [router.query.parametersCount]);
  // Set the initial parameters list only on first render
  useEffect(() => {
    if (isFirstRender && parameters?.data) {
      const initialList = parameters?.data?.map(({ id, name }) => ({
        value: id?.toString(),
        name,
      }));
      setInitialSearchList(initialList.reverse());
      setIsFirstRender(false);
    }
  }, [parameters?.data, isFirstRender]);
  return (
    <AccessLevel module={"parameter"} permission={["view"]}>
      <>
        <Card className="border-2 border-info border-opacity-10 p-5 md:p-8">
          <AccessLevel module={"parameter"} permission={["create"]}>
            <div className="mb-8 flex w-full flex-col items-center md:flex-row">
              <div className="w-full md:w-2/5">
                {/* <Input
                  placeholder="نام پارامتر یا آزمون را وارد کنید"
                  label="جستجوی پارامتر"
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
                      router.query.search_parameter = activeItem?.name;
                      router.push(router);
                    } else {
                      delete router.query.search_parameter;
                      router.push(router);
                    }
                  }}
                  className="w-full"
                  resettable
                  label={"جستجوی پارامتر"}
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
                        {activeItem?.name ?? "نام پارامتر را انتخاب کنید"}
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
                  onClick={handleOpenModal(ModalKeys.OPERATOR_CREATE_PARAMETER)}
                  startIcon={
                    <SvgIcon
                      fillColor={"white"}
                      className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
                    >
                      <IcAddDocument />
                    </SvgIcon>
                  }
                >
                  اضافه کردن پارامتر
                </Button>
              </div>
            </div>
          </AccessLevel>
          {parameters?.data.length === 0 && (
            <Card color="info" className="w-full p-7 text-center text-[14px]">
              <p>پارامتری یافت نشد.</p>
            </Card>
          )}
          {parameters?.data.length !== 0 && (
            <>
              <div className="my-2 hidden w-full rounded-[10px] bg-background-paper-dark p-7 font-bold md:flex">
                <span className="w-[25%]">نام پارامتر</span>
                <span className="w-[25%]">نام آزمون</span>
                <span className="w-[19%]">مبلغ واحد</span>
                <span className="w-[19%]">مبلغ فوری</span>
                <span className="w-[12%]">اقدامات</span>
              </div>
              {parameters?.data?.toReversed().map((item, index) => (
                <Card
                  key={index}
                  color={index % 2 === 0 ? "paper" : "white"}
                  variant={index % 2 === 0 ? "flat" : "outline"}
                  className="mb-2 flex w-full flex-wrap items-center justify-between gap-4 rounded-[10px] px-7 py-6 text-[14px] md:gap-0"
                >
                  <span className="w-full md:w-[25%]">
                    <span className="font-bold md:hidden">پارامتر:</span>{" "}
                    {item.name}
                  </span>
                  <span className="w-full md:w-[25%]">
                    <span className="font-bold md:hidden">آزمون:</span>{" "}
                    {item.exp_name}
                  </span>
                  <span className="w-full md:w-[19%]">
                    <span className="font-bold md:hidden">مبلغ واحد:</span>{" "}
                    {Number(item.price).toLocaleString()}
                    <span className="mr-1 text-[13px]">(ریال)</span>
                  </span>

                  <span className="w-full md:w-[19%]">
                    <span className="font-bold md:hidden">مبلغ فوری:</span>{" "}
                    {Number(item.urgent_price) !== 0
                      ? Number(item.urgent_price).toLocaleString()
                      : "---"}
                    {Number(item.urgent_price) !== 0 && (
                      <span className="mr-1 text-[13px]">(ریال)</span>
                    )}
                  </span>
                  <span className="flex w-full justify-end gap-2 md:w-[12%] md:justify-normal">
                    <AccessLevel module={"parameter"} permission={["view"]}>
                      <ActionView
                        item={item}
                        modalKey={ModalKeys.OPERATOR_VIEW_PARAMETER}
                      />
                    </AccessLevel>
                    <AccessLevel module={"parameter"} permission={["update"]}>
                      <ActionEdit
                        item={item}
                        modalKey={ModalKeys.OPERATOR_EDIT_PARAMETER}
                      />
                    </AccessLevel>
                    <AccessLevel module={"parameter"} permission={["delete"]}>
                      <ActionDelete
                        item={item}
                        modalKey={ModalKeys.OPERATOR_DELETE_PARAMETER}
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
          className="w-full sm:w-auto"
          onClick={handleOpenModal(ModalKeys.OPERATOR_SUBMIT_PARAMETER_DIALOG)}
          startIcon={
            <SvgIcon
              fillColor={"white"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcCheck />
            </SvgIcon>
          }
        >
          ثبت پارامترها
        </Button> */}
        </Card>
      </>
    </AccessLevel>
  );
};

export default ParameterInformation;
