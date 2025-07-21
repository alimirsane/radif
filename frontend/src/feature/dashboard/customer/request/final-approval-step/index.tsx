import { useRouter } from "next/router";

import { Card } from "@kit/card";
import { SampleDataCard } from "./sample-data-card";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@kit/button";
import {
  IcArrowLeft,
  IcArrowRight,
  IcCardList,
} from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { routes } from "@data/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFormResponse } from "@api/service/form-response";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import ParameterInformation from "../../request-id/components/parameter-information";
import { apiRequest } from "@api/service/request";
import CartSamples from "../sample-data-entry/cart-samples";
import ExperimentInfo from "./sample-data-card/experiment-info";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import Badge from "@feature/kits/badge";
import { useCopySampleHandler } from "@hook/copy-sample-handler";
import ReturnSample from "../view-sub-requests/return-sample";
import { apiAppointment } from "@api/service/appointment";
import { DateHandler } from "@utils/date-handler";

export const FinalApprovalStep = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // get current request id
  const { requestId, setRequestId, experimentId, setExperimentId } =
    useCurrentRequestHandler();
  // get the store clearSamples function
  const clearSamples = useCopySampleHandler((state) => state.clearSamples);
  const {
    data: samplesList,
    isLoading: samplesLoading,
    refetch: refetchSamples,
  } = useQuery(apiFormResponse().getAll({ request: requestId ?? "-1" }));
  useEffect(() => {
    refetchSamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: request, isLoading: requestLoading } = useQuery(
    apiRequest().getById(requestId?.toString()),
  );
  // modal
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    if (request?.data?.experiment_obj?.status !== "active") return;
    // pass modal key and experiment id
    openModal(modalKey, {
      experimentId: request?.data?.experiment,
      selectedParameters: request?.data?.parameter_obj,
      requestId: request?.data?.id,
      isUrgent: request?.data?.is_urgent,
    });
  };

  // check if button is clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // complete request api
  const { mutateAsync: completeRequest } = useMutation(
    apiRequest(true, {
      success: "تایید اطلاعات درخواست موفقیت آمیز بود",
      fail: "تایید اطلاعات درخواست انجام نشد",
      waiting: "در حال انتظار",
    }).completeRequest(requestId ?? -1),
  );
  // submit request
  const submitRequest = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      is_completed: true,
      has_parent_request: true,
      parent_request: Number(router.query.request),
    };
    completeRequest(data)
      .then((res) => {
        setRequestId(undefined);
        router.query.step = router.query.step = (
          Number(router.query.step) + 1
        ).toString();
        router.push(router);
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
    // }
  };
  // appointments status
  const appointmentStatus = useMemo(() => {
    return {
      "reserved-active": "رزرو شده",
      "reserved-suspended": "رزرو تعلیق شده",
      "canceled-active": "کنسل شده",
      "canceled-suspended": "کنسلی تعلیق شده",
      "pending-active": "پیش پرداخت",
      "pending-suspended": "پیش پرداخت تعلیق شده",
    };
  }, []);
  // redirect to dashboard if data is empty
  // useEffect(() => {
  //   if (!samplesList?.data.length) {
  //     router.push({
  //       pathname: routes.customer(),
  //       query: {},
  //     });
  //   }
  // }, [samplesList]);

  return (
    <>
      <Card
        color="info"
        className="flex flex-col items-center px-4 py-6 lg:py-12"
      >
        <h6 className="w-full text-[14px] lg:w-5/6">
          لطفا اطلاعات نهایی آزمون خود را تایید کنید.
        </h6>
        {/*<Button*/}
        {/*  onClick={() => {*/}
        {/*    refetchSamples();*/}
        {/*  }}*/}
        {/*>*/}
        {/*  fetch all samples*/}
        {/*</Button>*/}
        <Card
          color="white"
          className="mt-6 w-full px-4 pb-7 pt-6 lg:w-5/6 lg:px-8"
        >
          <ExperimentInfo experiment={request?.data?.experiment_obj} />
        </Card>
        <Card
          color="white"
          className="mt-6 w-full px-4 pb-2 pt-6 lg:w-5/6 lg:px-8"
        >
          <h6 className="mb-3 text-[16px] font-bold">اطلاعات نمونه‌ها</h6>
          <div className="grid gap-7 pb-6 md:grid-cols-2 ">
            {// hasFetched &&
            samplesList?.data
              ?.filter((sample) => sample.is_main)
              .map((item, index) => (
                <div key={index} className="flex">
                  <SampleDataCard
                    sampleNumber={index}
                    sample={item}
                    requestIsCompleted={request?.data?.is_completed ?? false}
                    test_unit_type={
                      request?.data?.experiment_obj?.test_unit_type
                    }
                  />
                </div>
              ))}
          </div>
        </Card>
        <Card
          color="white"
          className="mt-6 w-full px-4 pb-8 pt-6 lg:w-5/6 lg:px-8"
        >
          <div className="flex flex-row items-center justify-between">
            <span className="flex flex-row">
              <h6 className="mb-3 text-[16px] font-bold">اطلاعات پارامترها</h6>
              {request?.data?.is_urgent && (
                <Badge color="error" className="mx-3">
                  فوری
                </Badge>
              )}
            </span>
            <Button
              variant="outline"
              className="mb-2"
              onClick={handleOpenModal(ModalKeys.REQUEST_PARAMETERS_LIST)}
            >
              ویرایش پارامترها
            </Button>
          </div>
          <ParameterInformation
            noTitle
            isUrgent={request?.data.is_urgent ?? false}
            parameterList={request?.data.parameter_obj ?? []}
          />
        </Card>
        {/* <Card color="white" className="mt-6 w-full px-4 py-6 md:w-5/6 lg:px-8">

          <ReturnSample isReturned={request?.data?.is_sample_returned} />
        </Card> */}

        {request?.data.experiment_obj?.need_turn && (
          <Card
            color="white"
            className="mt-6 w-full px-4 py-6 lg:w-5/6 lg:px-8"
          >
            <div className="flex flex-row items-center justify-between">
              <span className="flex flex-row">
                <h6 className="mb-3 text-[16px] font-bold">
                  نوبت‌های رزرو شده برای این آزمون
                </h6>
              </span>
              <Button
                variant="outline"
                className="mb-2"
                onClick={() => {
                  setRequestId(request?.data?.id);
                  setExperimentId(request?.data?.experiment);
                  openModal(ModalKeys.CUSTOMER_SELECT_APPOINTMENT, {
                    experimentId: request?.data?.experiment,
                    mode: "edit",
                  });
                }}
              >
                ویرایش نوبت
              </Button>
            </div>
            {request?.data.appointments_obj?.length === 0 ? (
              <p className="text-[14px] text-error">
                نوبت موردنظر خود را ثبت نمایید.
              </p>
            ) : (
              <div className="grid gap-7 py-2 md:grid-cols-2">
                {request?.data.appointments_obj?.map((item, index) => (
                  <Card
                    key={index}
                    variant="outline"
                    color="white"
                    className="items-center px-5 py-4"
                  >
                    <span className="flex flex-col items-center justify-between md:flex-row">
                      <h6 className="text-[16px] font-[700]">
                        تاریخ:
                        <span className="mr-1 text-[14px] font-normal">
                          {DateHandler.formatDate(item?.date, {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}
                        </span>
                      </h6>
                      <span className="flex flex-row gap-1 text-[16px] font-[700]">
                        وضعیت:
                        <span
                          className={`rounded-full px-4 py-[2px] ${item.status}-${item?.extra_fields?.queue_status} text-[13px]`}
                        >
                          {
                            appointmentStatus[
                              `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                            ]
                          }
                        </span>
                      </span>
                    </span>
                    <span className="flex flex-col items-center justify-between pt-4 md:flex-row">
                      <h6 className="text-[16px] font-[700]">
                        ساعت:
                        <span className="mr-1 text-[14px] font-normal">
                          {item?.end_time?.split(":")?.[0] +
                            ":" +
                            item?.end_time?.split(":")?.[1]}
                          {" - "}
                          {item?.start_time?.split(":")?.[0] +
                            ":" +
                            item?.start_time?.split(":")?.[1]}
                        </span>
                      </h6>
                      {/* <Button
                        onClick={() => {
                          openModal(
                            ModalKeys.CUSTOMER_CANCEL_APPOINTMENT,
                            item,
                          );
                        }}
                      >
                        کنسل کردن نوبت
                      </Button> */}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}
        <Card
          color="white"
          className="mt-6 w-full px-4 pb-8 pt-6 lg:w-5/6 lg:px-8"
        >
          <h6 className="mb-3 text-[16px] font-bold">هزینه آزمون</h6>

          <CartSamples />
        </Card>
      </Card>
      <div className="flex flex-col-reverse justify-end pt-3 sm:flex-row sm:py-7">
        {router.query.action === "add" && (
          <Button
            className="my-2 w-full sm:my-auto sm:ml-5 sm:w-auto"
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
        )}
        {!request?.data?.is_completed && (
          <Button
            className="my-2 w-full sm:my-auto sm:ml-5 sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
              >
                <IcArrowRight />
              </SvgIcon>
            }
            variant="outline"
            onClick={() => {
              clearSamples();
              router.query.step = (Number(router.query.step) - 1).toString();
              router.push(router);
            }}
          >
            ورود اطلاعات نمونه
          </Button>
        )}
        <Button
          variant="solid"
          color="primary"
          className="my-2 w-full sm:my-auto sm:w-auto"
          endIcon={
            <SvgIcon
              fillColor={"white"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcArrowLeft />
            </SvgIcon>
          }
          disabled={
            (request?.data.appointments_obj?.length === 0 &&
              request?.data?.experiment_obj?.need_turn) ||
            isSubmitting
          }
          onClick={submitRequest}
        >
          {/* ثبت نهایی درخواست */}
          تایید اطلاعات آزمون
        </Button>
      </div>
    </>
  );
};
