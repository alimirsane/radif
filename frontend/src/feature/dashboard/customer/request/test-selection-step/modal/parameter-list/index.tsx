import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useModalHandler } from "@utils/modal-handler/config";
import { ParameterCard } from "../parameter-card";
import { FinalCostCard } from "../../common/cost-card";
import {
  IcArrowLeft,
  IcClose,
  IcInfoBox,
  IcSearch,
} from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { ParameterType } from "@api/service/parameter/type";
import { apiParameter } from "@api/service/parameter";
import { apiRequest } from "@api/service/request";

import { useDebounce } from "@utils/use-debounce";
import { useOperatorSearchHandler } from "../../../../../../../hook/operator-search-handler";
import { useCurrentRequestHandler } from "../../../../../../../hook/current-request-handler";
import { Switch } from "@kit/switch";
import { apiExperiment } from "@api/service/experiment";
import { WeeklyCalendarLayout } from "@feature/kits/calendar";
import Tooltip from "@kit/tooltip";

export const ParametersList = () => {
  const router = useRouter();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  const queryClient = useQueryClient();

  const isPartner = useCurrentRequestHandler((state) => state.isPartner);
  // get test id
  const modalData = useModalHandler<
    | {
        experimentId: string;
        selectedParameters: ParameterType[];
        requestId?: number;
        isUrgent?: boolean;
        laboratoryStatus?: string;
        experimentStatus?: string;
        deviceStatus?: string;
      }
    | undefined
  >((state) => state.modalData);

  const { data: currentExperiment } = useQuery(
    apiExperiment().getByIdPublic(modalData?.experimentId ?? ""),
  );
  const [turn, setTurn] = useState<string | undefined>(undefined);

  const needTurn = useMemo(() => {
    return currentExperiment?.data?.need_turn as unknown as boolean;
  }, [currentExperiment?.data?.need_turn]);

  useEffect(() => {
    if (needTurn) return;
    setTurn("");
  }, [needTurn]);

  // set search value in state management
  const setSerachInputValue = useOperatorSearchHandler(
    (state) => state.setSearchValue,
  );
  // immediate switch
  const [switchIsChecked, setChecked] = useState<boolean>(
    modalData?.isUrgent ?? false,
  );
  // get search value
  const { searchValue, setSearchValue } = useOperatorSearchHandler();
  const searchQueryParam = useMemo(() => {
    return searchValue as string | undefined;
  }, [searchValue]);
  // get parameters data
  const { data: parameters, isLoading: parametersLoading } = useQuery(
    apiParameter().getAllByExperimentId(
      modalData?.experimentId,
      searchQueryParam,
    ),
  );
  // define debounce
  const { value, debouncedValue, setValue } = useDebounce("");
  // set state management based on search input + refetch data
  useEffect(() => {
    setSerachInputValue(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  // selected parameters
  const [selectedItems, setSelectedItems] = useState<ParameterType[]>(
    modalData?.selectedParameters ?? [],
  );
  // toggle checkbox and add/remove item from selectedItems array
  const handleCheckboxChange = (item: ParameterType): void => {
    setSelectedItems((prevItems) => {
      const selectedIndex = prevItems.findIndex(
        (selectedItem) => selectedItem.id === item.id,
      );
      if (selectedIndex === -1) {
        return [...prevItems, { ...item, selected: true }];
      } else {
        const updatedSelectedItems = [...prevItems];
        updatedSelectedItems.splice(selectedIndex, 1);
        return updatedSelectedItems;
      }
    });
  };
  const getParamPrice = (param: ParameterType) => {
    if (switchIsChecked) {
      if (isPartner) {
        return param.partner_urgent_price !== null
          ? Number(param.partner_urgent_price)
          : param.partner_price !== null
            ? Number(param.partner_price)
            : Number(param.price);
      } else {
        return Number(param.urgent_price);
      }
    } else {
      if (isPartner) {
        return param.partner_price !== null
          ? Number(param.partner_price)
          : Number(param.price);
      } else {
        return Number(param.price);
      }
    }
  };
  // calculate total price
  const getTotalCost = () => {
    let totalCost = 0;
    selectedItems.forEach((item) => {
      // if (switchIsChecked) {
      //   totalCost += Number(item.urgent_price);
      // } else {
      //   totalCost += isPartner
      //     ? item.partner_price === null
      //       ? Number(item.price)
      //       : Number(item.partner_price)
      //     : Number(item.price);
      // }
      totalCost += getParamPrice(item);
    });
    return totalCost;
  };
  // calculate count of selected parameters
  const getSelectedItemsCount = () => {
    return selectedItems.length;
  };
  // request create api
  const { mutateAsync: createParentRequest } = useMutation(
    apiRequest(false).create(),
  );
  const { mutateAsync: createChildRequest } = useMutation(
    apiRequest(true, {
      success: "ثبت درخواست موفقیت آمیز بود",
      fail: "ثبت درخواست انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // request edit api
  const { mutateAsync: editRequest } = useMutation(
    apiRequest(true, {
      success: "ویرایش پارامترها موفقیت آمیز بود",
      fail: "ویرایش پارامترها انجام نشد",
      waiting: "در حال انتظار",
    }).updateRequestParameters(modalData?.requestId ?? -1),
  );
  // set requestId in state management
  const setRequestId = useCurrentRequestHandler((state) => state.setRequestId);
  // submit request
  const submitRequest = () => {
    if (!router.query.hasOwnProperty("request")) {
      submitParentRequest();
    } else {
      submitchildRequest();
    }
  };
  const submitParentRequest = () => {
    const data = {
      experiment: Number(modalData?.experimentId),
      parameter: selectedItems.map((parameter) => parameter.id),
      // is_urgent: switchIsChecked,
    };
    createParentRequest(data)
      .then((res) => {
        router.query.request = res?.data.id?.toString();
        router.push(router);
        submitchildRequest();
      })
      .catch((err) => {});
  };
  const submitchildRequest = () => {
    const data = {
      experiment: Number(modalData?.experimentId),
      parameter: selectedItems.map((parameter) => parameter.id),
      is_urgent: switchIsChecked,
      has_parent_request: true,
      parent_request: Number(router.query.request),
      test_duration:
        currentExperiment?.data?.test_unit_type === "sample" ||
        currentExperiment?.data?.test_unit_type === "نمونه"
          ? 0
          : 1,
    };
    createChildRequest(data)
      .then((res) => {
        // set request id state
        setRequestId(res?.data.id);
        // close modal
        hideModal();
        // set query params
        delete router.query.item;
        // navigate to next step
        router.query.step = "2";
        router.push(router);
      })
      .catch((err) => {});
  };
  // update requests -> parameters
  const updateRequest = () => {
    const data = {
      experiment: Number(modalData?.experimentId),
      parameter: selectedItems.map((parameter) => parameter.id),
      is_urgent: switchIsChecked,
    };
    editRequest(data)
      .then((res) => {
        // close modal
        hideModal();
        // refetch data
        queryClient.invalidateQueries({
          queryKey: [apiRequest().url],
        });
      })
      .catch((err) => {});
  };

  const allParameterHasForcePrice = useMemo(() => {
    if (isPartner)
      return parameters?.data?.every(
        (parameter) => parameter.partner_urgent_price !== null,
      );
    else
      return parameters?.data?.every(
        (parameter) => parameter.urgent_price !== "0",
      );
  }, [parameters?.data, isPartner]);

  return (
    <Card
      color={"paper"}
      className="flex max-h-[95vh] w-[95vw] flex-col px-7 pb-6 pt-4 md:max-h-[80vh] md:w-[80vw] md:pb-14 md:pt-8"
    >
      <div className="flex flex-row items-center justify-between md:mb-4">
        <h6 className="text-[22px] font-[700]">فهرست پارامتر(ها)</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      {modalData?.laboratoryStatus === "inactive" ||
      modalData?.experimentStatus === "inactive" ||
      modalData?.deviceStatus === "inactive" ? (
        <Card
          color="info"
          className="mt-7 flex justify-center border border-background-paper-dark px-6 py-8 md:mx-6"
        >
          امکان ثبت درخواست برای این آزمون وجود ندارد.
          {modalData?.laboratoryStatus === "inactive" && (
            <span className="px-1">آزمایشگاه انتخاب شده غیرفعال می‌باشد.</span>
          )}
          {modalData?.experimentStatus === "inactive" && (
            <span className="px-1">آزمون انتخاب شده غیرفعال می‌باشد.</span>
          )}
          {modalData?.deviceStatus === "inactive" && (
            <span className="px-1">دستگاه مربوطه غیرفعال می‌باشد.</span>
          )}
        </Card>
      ) : (
        <>
          <div className="order-last mt-5 md:order-none">
            <FinalCostCard
              paramsCount={getSelectedItemsCount()}
              price={getTotalCost()}
              estimatedResultTime={
                currentExperiment?.data?.estimated_result_time ?? ""
              }
              estimatedResultTimeUrgent={
                currentExperiment?.data?.estimated_urgent_result_time ?? ""
              }
              testUnitType={currentExperiment?.data?.test_unit_type ?? ""}
              isUrgent={switchIsChecked}
            >
              <Button
                onClick={
                  modalData?.selectedParameters.length === 0
                    ? submitRequest
                    : updateRequest
                }
                className="mt-4 w-full whitespace-nowrap md:mt-auto md:w-auto"
                variant="solid"
                disabled={getSelectedItemsCount() <= 0}
                // disabled={getSelectedItemsCount() <= 0 || turn === undefined}
                endIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                  >
                    <IcArrowLeft />
                  </SvgIcon>
                }
              >
                {modalData?.selectedParameters.length === 0
                  ? "ثبت درخواست"
                  : "ویرایش پارامترها"}
              </Button>
            </FinalCostCard>
          </div>
          <div className="grid grid-cols-1 gap-4 pb-6 pt-5 md:grid-cols-2">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="پارامتر مورد نظر خود را جستجو کنید"
                label={"جستجو پارامتر"}
                className="w-full"
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

            {
              // allParameterHasForcePrice &&
              // && !isPartner
              <div className="flex w-full items-center pt-5">
                <Tooltip
                  message={
                    allParameterHasForcePrice
                      ? "با انتخاب گزینه درخواست فوری، پاسخ آزمایش شما در مدت زمان کوتاه‌تری آماده خواهد شد. توجه کنید متناسب با آن هزینه پرداختی متفاوت خواهد بود."
                      : "امکان ثبت درخواست فوری برای این آزمون وجود ندارد. لطفا با پذیرش آزمایشگاه تماس بگیرید."
                  }
                >
                  <span className="flex flex-row items-center">
                    <SvgIcon fillColor="info" className="ml-2 cursor-pointer">
                      <IcInfoBox />
                    </SvgIcon>

                    <Switch
                      checked={switchIsChecked}
                      onChange={() => setChecked(!switchIsChecked)}
                      disabled={!allParameterHasForcePrice}
                    >
                      <span
                        className={`${allParameterHasForcePrice ? "" : "text-typography-secondary"} font-bold`}
                      >
                        درخواست فوری
                      </span>
                    </Switch>
                  </span>
                </Tooltip>
              </div>
            }
          </div>
          <div className="grid gap-4 overflow-y-auto lg:grid-cols-2">
            {!parameters?.data.length && (
              <Card
                color="white"
                className="col-span-2 mt-2 w-full border border-background-paper-dark p-7 text-center text-[14px]"
              >
                <p>پارامتری برای این آزمون یافت نشد.</p>
              </Card>
            )}
            {parameters?.data.map((item, index) => (
              <ParameterCard
                key={index}
                id={item.id}
                urgentPriceIsChecked={switchIsChecked}
                name={item.name}
                price={item.price}
                urgent_price={item.urgent_price}
                partner_price={item.partner_price}
                partner_urgent_price={item.partner_urgent_price}
                exp_name={item.exp_name}
                name_en={item.name_en}
                experiment={item.experiment}
                unit={item.unit}
                unit_value={item.unit_value}
                isPartner={isPartner ?? false}
                selected={selectedItems
                  .map((item) => item.id)
                  .includes(item.id)}
                action={() => handleCheckboxChange(item)}
              />
            ))}
          </div>
        </>
      )}
      {/* {needTurn && (
        <div className={"flex max-w-[320px] flex-col gap-2 pt-[50px]"}>
          <span className={"font-bold"}>انتخاب نوبت</span>
          <WeeklyCalendarLayout
            onDateChange={(date) => {
              setTurn(date);
            }}
          />
        </div>
      )} */}
    </Card>
  );
};
