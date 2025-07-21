import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcArrowLeft,
  IcArrowRight,
  IcCardList,
  IcInfoBox,
} from "@feature/kits/common/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiExperiment } from "@api/service/experiment";
import Header from "@feature/dashboard/common/header";
import { Switch } from "@kit/switch";
import Tooltip from "@kit/tooltip";
import { apiParameter } from "@api/service/parameter";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { ParameterCard } from "../test-selection-step/modal/parameter-card";
import { ParameterType } from "@api/service/parameter/type";
import { apiRequest } from "@api/service/request";

const ParameterSelectionStep = () => {
  const router = useRouter();
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);

  useEffect(() => {
    // Prevent going back (block browser back button)
    const pushToHistory = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const handlePopState = (e: PopStateEvent) => {
      // Re-push the current URL to prevent going back
      pushToHistory();
    };

    // Prevent page refresh or tab closing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Show browser confirmation dialog
    };

    pushToHistory(); // Initial history push to trap the user on the page
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // set requestId in state management
  const setRequestId = useCurrentRequestHandler((state) => state.setRequestId);
  const requestId = useCurrentRequestHandler((state) => state.requestId);
  // get user info from state management
  const isPartner = useCurrentRequestHandler((state) => state.isPartner);

  // get request data
  const { data: request, refetch: refetchRequestData } = useQuery({
    ...apiRequest().getById(requestId?.toString()),
    enabled: false,
  });
  const experimentId = useMemo(() => {
    return router.query.exp
      ? (router.query.exp as string)
      : request?.data?.experiment;
  }, [router.query.exp, request]);
  useEffect(() => {
    if (requestId) refetchRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);
  // get experiment data
  const { data: experiment } = useQuery(
    apiExperiment().getByIdPublic(experimentId ? experimentId?.toString() : ""),
  );
  // get parameters data
  const { data: parameters } = useQuery(
    apiParameter().getAllByExperimentId(
      experimentId ? experimentId?.toString() : "",
    ),
  );
  // urgent request switch
  const [switchIsChecked, setChecked] = useState<boolean>(
    router.query.hasOwnProperty("request") &&
      !router.query.hasOwnProperty("action")
      ? request?.data?.is_urgent ?? false
      : false,
  );
  // selected parameters
  const [selectedItems, setSelectedItems] = useState<ParameterType[]>(
    // router.query.hasOwnProperty("request") &&
    //   !router.query.hasOwnProperty("action")
    //   ? // && !router.query.hasOwnProperty("appt")
    //     request?.data?.parameter_obj ?? []
    //   :
    [],
  );
  useEffect(() => {
    setSelectedItems(request?.data?.parameter_obj ?? []);
  }, [request, router.query]);
  const experimentSpecifications = useMemo(() => {
    return {
      specifications: {
        نام: experiment?.data.name
          ? experiment?.data.name + " (" + experiment?.data.name_en + ") "
          : "---",
        "نوع واحد آزمون": experiment?.data?.test_unit_type
          ? unitsList.find(
              (unit) => unit.value === experiment?.data?.test_unit_type,
            )?.name ?? experiment?.data.test_unit_type
          : "---",
        "زمان انتظار انجام آزمون": switchIsChecked
          ? experiment?.data?.estimated_urgent_result_time || "-"
          : experiment?.data?.estimated_result_time,
      },
    };
  }, [experiment, unitsList, switchIsChecked]);

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
  // calculate count of selected parameters
  const getSelectedItemsCount = () => {
    return selectedItems.length;
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
      totalCost += getParamPrice(item);
    });
    return totalCost;
  };

  // request create api
  const { mutateAsync: createParentRequest } = useMutation(
    apiRequest(false).create(),
  );
  const { mutateAsync: createChildRequest } = useMutation(
    apiRequest(true, {
      success: "ثبت پارامترها موفقیت آمیز بود",
      fail: "ثبت پارامترها انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );

  // request edit api
  const { mutateAsync: editRequest } = useMutation(
    apiRequest(true, {
      success: "ثبت پارامترها موفقیت آمیز بود",
      fail: "ثبت پارامترها انجام نشد",
      waiting: "در حال انتظار",
    }).updateRequestParameters(requestId ?? -1),
  );

  // check if button is clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // submit request
  const submitRequest = () => {
    if (!router.query.hasOwnProperty("request")) {
      submitParentRequest();
    } else {
      if (
        requestId &&
        (!router.query.hasOwnProperty("action") ||
          router.query.hasOwnProperty("appt"))
      ) {
        updateRequest();
      } else {
        submitchildRequest();
      }
    }
  };
  const submitParentRequest = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      experiment: Number(experimentId),
      parameter: selectedItems.map((parameter) => parameter.id),
      // is_urgent: switchIsChecked,
    };
    createParentRequest(data)
      .then((res) => {
        router.query.request = res?.data.id?.toString();
        router.push(router);
        submitchildRequest();
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };
  const submitchildRequest = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      experiment: Number(experimentId),
      parameter: selectedItems.map((parameter) => parameter.id),
      is_urgent: switchIsChecked,
      has_parent_request: true,
      parent_request: Number(router.query.request),
      test_duration:
        experiment?.data?.test_unit_type === "sample" ||
        experiment?.data?.test_unit_type === "نمونه"
          ? 0
          : 1,
    };
    createChildRequest(data)
      .then((res) => {
        // set request id state
        setRequestId(res?.data.id);
        // set query params
        delete router.query.item;
        // navigate to next step
        router.query.step = "3";
        router.push(router);
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };
  // update requests -> parameters
  const updateRequest = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      experiment: Number(experimentId),
      parameter: selectedItems.map((parameter) => parameter.id),
      is_urgent: switchIsChecked,
    };
    editRequest(data)
      .then((res) => {
        // set query params
        delete router.query.item;
        // navigate to next step
        router.query.step = "3";
        router.push(router);
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Card color="info" className="w-full p-[24px] text-typography-main">
        <Card color="white" className="px-3 pb-4 pt-5 md:px-5">
          {/* header */}
          <div className="flex flex-row">
            <h3 className="grow px-2 text-[20px] font-[700]">مشخصات آزمون</h3>
          </div>
          {/* specifications */}
          <div className="flex flex-col gap-1 pt-3 md:pb-3 lg:flex-row">
            {Object.entries(experimentSpecifications?.specifications).map(
              ([key, value], index) => (
                <Card
                  key={index}
                  color="paper"
                  className="mx-2 flex flex-wrap items-center gap-2 px-4 py-3.5"
                >
                  <h6 className="text-[16px] font-[500]">{key}:</h6>
                  <span className="text-[14px]">
                    {value}
                    {index === 2 && (
                      <span className="mr-1 text-[14px] font-[400]">
                        روز کاری
                      </span>
                    )}
                  </span>
                </Card>
              ),
            )}
          </div>
          <div className="flex flex-col gap-1 py-1 md:py-3 lg:flex-row">
            <Card
              color="paper"
              className="mx-2 flex flex-wrap items-center gap-2 px-4 py-3.5"
            >
              <h6 className="text-[16px] font-[500]">تعداد پارامترها:</h6>
              <span className="text-[14px]">{getSelectedItemsCount()}</span>
            </Card>
            <Card
              color="paper"
              className="mx-2 flex flex-wrap items-center gap-2 px-4 py-3.5"
            >
              <h6 className="text-[16px] font-[500]">هزینه نهایی:</h6>
              <span className="text-[14px]">
                {getTotalCost().toLocaleString()}
                <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
              </span>
            </Card>
          </div>
          <div className="flex flex-col gap-1 py-1 md:py-3 lg:flex-row">
            <Card
              color="error"
              className="mx-2 flex flex-wrap items-center gap-2 bg-opacity-5 px-4 py-3.5"
            >
              <h6 className="text-[16px] font-bold text-error">
                توضیحات آزمون:
              </h6>
              <span className="text-[14px]">
                {experiment?.data?.description}
              </span>
            </Card>
          </div>
        </Card>
        <div className="mb-5 flex flex-col justify-between pt-5 md:flex-row md:items-center md:pt-12">
          <Header
            title="فهرست پارامترهای آزمون"
            description="پارامترهای این آزمون به شرح زیر می‌باشد:"
          />

          {/* allParameterHasForcePrice  */}
          <div className="flex items-center pt-5">
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
        </div>
        <Card color="white" className="grid gap-4 p-4 md:p-7 lg:grid-cols-2">
          {!parameters?.data.length ? (
            <p className="text-[14px]">پارامتری برای این آزمون یافت نشد.</p>
          ) : (
            parameters?.data.map((item, index) => (
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
            ))
          )}
        </Card>
        {/* <ParametersList /> */}
      </Card>
      <div className="flex flex-col-reverse justify-end pt-3 sm:flex-row sm:py-7">
        {router.query.action === "add" ? (
          <>
            <Button
              className="my-2 w-full sm:my-auto sm:w-auto"
              startIcon={
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
                >
                  <IcCardList />
                </SvgIcon>
              }
              variant="outline"
              onClick={() => {
                router.query.step = "6";
                router.push(router);
              }}
            >
              آزمون‌های ثبت شده
            </Button>
            <Button
              className="my-2 w-full sm:mx-5 sm:my-auto sm:w-auto"
              startIcon={
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                >
                  <IcArrowRight />
                </SvgIcon>
              }
              variant="outline"
              type="button"
              onClick={() => {
                router.query.step = (Number(router.query.step) - 1).toString();
                router.push(router);
              }}
            >
              انتخاب آزمون
            </Button>
          </>
        ) : (
          <Button
            className="my-2 w-full sm:mx-5 sm:my-auto sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
              >
                <IcArrowRight />
              </SvgIcon>
            }
            variant="outline"
            type="button"
            onClick={() => {
              router.query.step = (Number(router.query.step) - 1).toString();
              router.push(router);
            }}
          >
            انتخاب آزمایشگاه و آزمون
          </Button>
        )}
        <Button
          type={"submit"}
          variant="solid"
          color="primary"
          className="my-2 w-full sm:my-auto sm:w-auto"
          onClick={() => {
            // router.query.step = (Number(router.query.step) + 1).toString();
            // router.push(router);
            submitRequest();
          }}
          disabled={getSelectedItemsCount() <= 0 || isSubmitting}
          endIcon={
            <SvgIcon
              fillColor={"white"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcArrowLeft />
            </SvgIcon>
          }
        >
          تایید شرایط و قوانین
        </Button>
      </div>
    </>
  );
};

export default ParameterSelectionStep;
