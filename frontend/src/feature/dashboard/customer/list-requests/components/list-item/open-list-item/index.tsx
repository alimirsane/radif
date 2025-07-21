import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";

import {
  IcCardList,
  IcChevronDoubleDown,
  IcCloseCircle,
  IcCloseSquare,
  IcEdit,
  IcReceipt,
  IcResults,
} from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import Tooltip from "@kit/tooltip";
import { Status } from "@kit/status";
import { iranSans } from "@data/font";
import { SvgIcon } from "@kit/svg-icon";
import Badge from "@feature/kits/badge";
import { DateHandler } from "@utils/date-handler";
import { ColorTypes } from "@kit/common/color-type";
import { RequestType } from "@api/service/request/type";
import { InvoicePrint } from "@feature/dashboard/operator/component/template/components/print-invoice";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

interface OpenListItemProps {
  request: RequestType;
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
  cancelRequest: (() => void) | undefined;
}

const OpenListItem = (props: OpenListItemProps) => {
  const router = useRouter();
  const { request, onClick, cancelRequest } = props;

  const openModal = useModalHandler((state) => state.openModal);

  const [printType, setPrintType] = useState("");
  const [printTitle, setPrintTitle] = useState("");
  const [readyToPrint, setReadyToPrint] = useState(false); // new state
  // ** use library for printing **
  const printRef = useRef<HTMLDivElement>(null);
  // print content
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: printTitle,
    onAfterPrint: () => {
      setPrintType("");
      setReadyToPrint(false);
    },
  });
  // Set readyToPrint to true when printType is set
  useEffect(() => {
    if (printType) {
      setReadyToPrint(true);
    }
  }, [printType]);
  // Trigger printing when readyToPrint is true
  useEffect(() => {
    if (readyToPrint) {
      handlePrint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToPrint]);
  // render component based on printType
  const renderedComponent = useMemo(() => {
    switch (printType) {
      case "customerInvoice":
        return <InvoicePrint request={request} invoiceType="مشتری" />;
      default:
        return <></>;
    }
  }, [printType, request]);
  return (
    <>
      {readyToPrint && (
        <div ref={printRef} className={iranSans.className}>
          {renderedComponent}
        </div>
      )}
      <Card
        className={
          "flex w-full flex-row transition-all duration-500 lg:border-0 lg:bg-background-paper-dark lg:bg-opacity-35 lg:px-10 lg:py-[24px] hover:lg:bg-background-paper-dark"
        }
        onClick={onClick}
      >
        <div className="flex w-1/2 flex-col items-center gap-2 lg:w-[40%] lg:flex-row lg:gap-0">
          {/* <span className="flex w-full lg:w-[12%] lg:justify-end lg:px-2">
            {request.is_urgent && <Badge color="error">فوری</Badge>}
          </span> */}
          <span className="flex w-full flex-row items-center gap-[6px] lg:w-[40%]">
            {request.request_number}
            {request?.is_sample_returned && (
              <Badge color="warning" className="bg-opacity-80">
                عودت نمونه
              </Badge>
            )}
          </span>
          <span className="w-full font-semibold lg:w-[30%] lg:font-normal">
            {request.child_requests?.length} آزمون
          </span>
          <span className="hidden w-full font-semibold lg:block lg:w-[30%] lg:font-normal">
            {request.labsnet ? "بله" : "خیر"}
          </span>
          <span className="w-full items-center pt-2 lg:hidden lg:w-[40%] lg:text-start">
            {!!request.price ? Number(request.price).toLocaleString() : "---"}
            <span className="ml-2 mr-1 text-[12px]">ریال</span>
            {/* {request.latest_status_obj?.step_obj.name ===
              "در انتظار پرداخت" && (
              <Button color="primary">پرداخت هزینه</Button>
            )} */}
          </span>
        </div>
        <div className="flex w-1/2 flex-col items-center gap-2 lg:w-[60%] lg:flex-row lg:gap-0">
          <span className="w-full text-left lg:w-[30%] lg:text-start">
            {request.has_prepayment ? (
              <Status className="mr-auto lg:mr-0" color="pending">
                در انتظار پیش پرداخت
              </Status>
            ) : (
              <Status
                className="mr-auto lg:mr-0"
                color={
                  request.latest_status_obj?.step_obj.step_color as ColorTypes
                }
              >
                {request.latest_status_obj?.step_obj.name !== "رد شده"
                  ? request.latest_status_obj?.step_obj.name
                  : `${request.latest_status_obj?.step_obj.name} ${request.is_cancelled ? "توسط کاربر" : ""}`}
              </Status>
            )}
          </span>
          <span className="w-full text-left lg:w-[20%] lg:text-start">
            {DateHandler.formatDate(request.created_at ?? "", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}

            {/* {request.is_returned && (
              <Badge color="error" className="py-[5px]">
                استرداد شده
              </Badge>
            )}  */}
          </span>
          <span className="hidden w-full items-center text-left lg:block lg:w-[30%] lg:text-start">
            {!!request.price ? Number(request.price).toLocaleString() : "---"}
            <span className="ml-2 mr-1 text-[12px]">ریال</span>
            {/* {request.latest_status_obj?.step_obj.name ===
              "در انتظار پرداخت" && (
              <Button color="primary">پرداخت هزینه</Button>
            )} */}
          </span>
          <span className="flex w-full flex-row justify-end gap-2 lg:w-[20%] lg:justify-center">
            {/* <Tooltip message="مشاهده آزمون‌ها">
              <span
                onClick={onClick}
                className="ml-1 cursor-pointer rounded-full border-[0.1rem] border-primary p-[3px]"
              >
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[13px] [&_svg]:w-[13px]"}
                >
                  <IcChevronDoubleDown />
                </SvgIcon>
              </span>
            </Tooltip> */}
            <Tooltip message="مشاهده آزمون‌ها">
              <SvgIcon
                onClick={onClick}
                fillColor={"primary"}
                className={`ml-1 cursor-pointer [&_svg]:h-[19px] [&_svg]:w-[19px]`}
              >
                <IcChevronDoubleDown />
              </SvgIcon>
            </Tooltip>
            <Tooltip message="نتایج درخواست">
              <SvgIcon
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (request.latest_status_obj?.step_obj.name !== "تکمیل شده")
                    return;
                  openModal(
                    ModalKeys.CUSTOMER_REQUEST_RESULT,
                    request?.child_requests,
                  );
                }}
                fillColor={"primary"}
                className={`${
                  request.latest_status_obj?.step_obj.name !== "تکمیل شده"
                    ? "cursor-not-allowed opacity-45"
                    : "cursor-pointer"
                } [&_svg]:h-[20px] [&_svg]:w-[20px]`}
              >
                <IcResults />
              </SvgIcon>
            </Tooltip>
            <Tooltip
              message={
                request?.latest_status_obj?.step_obj?.name ===
                  "در ‌انتظار نمونه" ||
                request?.latest_status_obj?.step_obj?.name === "در حال انجام" ||
                request?.latest_status_obj?.step_obj?.name === "تکمیل شده" ||
                request?.latest_status_obj?.step_obj?.name === "رد شده"
                  ? "چاپ صورت حساب مشتری"
                  : "چاپ پیش فاکتور"
              }
            >
              <SvgIcon
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setPrintType("customerInvoice");
                  setPrintTitle(
                    `${request?.request_number}-${
                      request?.latest_status_obj?.step_obj?.name ===
                        "در ‌انتظار نمونه" ||
                      request?.latest_status_obj?.step_obj?.name ===
                        "در حال انجام" ||
                      request?.latest_status_obj?.step_obj?.name ===
                        "تکمیل شده" ||
                      request?.latest_status_obj?.step_obj?.name === "رد شده"
                        ? "صورت-حساب-مشتری"
                        : "پیش-فاکتور"
                    }`,
                  );
                }}
                fillColor={"primary"}
                className={`mr-1 cursor-pointer [&_svg]:h-[20px] [&_svg]:w-[20px]`}
              >
                <IcReceipt />
              </SvgIcon>
            </Tooltip>
            <Tooltip message="ویرایش درخواست">
              <SvgIcon
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (
                    request.latest_status_obj?.step_obj.name !==
                    "در انتظار اپراتور"
                  )
                    return;
                  // route: /dashboard/customer/request?lab=27&request=1065&step=5
                  router.push({
                    pathname: routes.customerRequest(),
                    query: {
                      ...router.query,
                      request: request.id?.toString(),
                      lab: request?.experiment_obj?.laboratory?.toString(),
                      step: "6",
                    },
                  });
                }}
                strokeColor={"primary"}
                className={`${
                  request.latest_status_obj?.step_obj.name !==
                  "در انتظار اپراتور"
                    ? "cursor-not-allowed opacity-45"
                    : "cursor-pointer"
                } mb-[2px] [&_svg]:h-[28px] [&_svg]:w-[28px]`}
              >
                <IcEdit />
              </SvgIcon>
            </Tooltip>
            <Tooltip message="لغو درخواست">
              {request.latest_status_obj?.step_obj.name ===
              "در انتظار اپراتور" ? (
                <SvgIcon
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    cancelRequest?.();
                  }}
                  fillColor={"primary"}
                  className={"cursor-pointer [&_svg]:h-[18px] [&_svg]:w-[18px]"}
                >
                  <IcCloseSquare />
                </SvgIcon>
              ) : (
                <SvgIcon
                  fillColor={"primary"}
                  className={
                    "cursor-not-allowed opacity-55 [&_svg]:h-[18px] [&_svg]:w-[18px]"
                  }
                >
                  <IcCloseSquare />
                </SvgIcon>
              )}
            </Tooltip>
          </span>
        </div>
      </Card>
      {/* <Card
        className={
          "grid grid-cols-2 justify-between transition-all duration-500 lg:flex lg:border-0 lg:bg-background-paper-light lg:px-[16px] lg:py-[24px] hover:lg:bg-background-paper-dark"
        }
      >
        <div className="flex flex-col justify-between lg:w-[43%] lg:flex-row lg:items-center">
          <span className="text-black text-18 flex items-center justify-center gap-2 font-semibold lg:w-[57%] lg:text-center lg:text-[14px] lg:font-normal">
            {request.is_urgent && <Badge color="error">فوری</Badge>}

            {request.experiment_obj?.name}
          </span>

          <span className="mt-[12px] lg:mt-0 lg:w-[43%] lg:text-center">
            {request.request_number}
          </span>
        </div>
        <div className="flex flex-col items-end justify-between lg:w-[26%] lg:flex-row lg:items-center">
          <Status
            color={
              request.latest_status_obj?.step_obj
                .next_button_color as ColorTypes
            }
          >
            {request.latest_status_obj?.step_obj.name}
          </Status>
          <span className="mt-[12px] lg:mt-0 lg:w-[50%] lg:text-center">
            {DateHandler.formatDate(request.created_at ?? "", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        </div>

        <div className="col-span-2 lg:flex lg:w-[31%] lg:items-center">
          <span className="hidden lg:block lg:w-[48%] lg:text-center">
            {request.delivery_date
              ? DateHandler.formatDate(request.delivery_date, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : request.experiment_obj?.estimated_result_time
                ? `${request.experiment_obj?.estimated_result_time} روز پس از دریافت نمونه`
                : `نامشخص`}
          </span>
          <span className="lg:pt-auto flex flex-row justify-end gap-4 pt-2 lg:w-[52%] lg:justify-center">
            <Tooltip message="خلاصه درخواست">
              <SvgIcon
                onClick={onClick}
                strokeColor={"primary"}
                className={"cursor-pointer [&_svg]:h-[28px] [&_svg]:w-[28px]"}
              >
                <IcEye />
              </SvgIcon>
            </Tooltip>

            <Tooltip message="رد درخواست">
              <SvgIcon
                onClick={() => {}}
                fillColor={"primary"}
                className={"cursor-pointer [&_svg]:h-[24px] [&_svg]:w-[24px]"}
              >
                <IcCloseCircle />
              </SvgIcon>
            </Tooltip>
          </span>
        </div>
      </Card> */}
    </>
  );
};

export default OpenListItem;
