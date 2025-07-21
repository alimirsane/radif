import { Card } from "@kit/card";
import { RequestType } from "@api/service/request/type";
import { Button } from "@kit/button";
import { useRouter } from "next/router";
import { usePayOrder } from "@hook/pay-order";
import { routes } from "@data/routes";
import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcEye } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { differenceInMinutes, parseISO } from "date-fns";
import { useCurrentRequestHandler } from "@hook/current-request-handler";

const RequestCost = ({ request }: { request: RequestType }) => {
  const router = useRouter();

  const openModal = useModalHandler((state) => state.openModal);

  // get current request id
  const { requestId, setRequestId, experimentId, setExperimentId } =
    useCurrentRequestHandler();
  // pay request price
  const setOrder = usePayOrder((state) => state.setOrder);
  const handlePaymentClick = () => {
    setOrder(request?.id?.toString(), request?.price?.toString());
    // Navigate to the customer payment route with the updated query parameter
    router.push(routes.customerPayment());
  };
  const handlePrePaymentClick = () => {
    setOrder(
      request?.id?.toString(),
      request?.total_prepayment_amount?.toString(),
    );
    // Navigate to the customer payment route with the updated query parameter
    router.push(routes.customerPrePayment());
  };
  return (
    <Card
      variant={"outline"}
      color={"paper"}
      className={
        "bg-background-paper-dark bg-opacity-50 p-3 text-[16px] lg:px-[24px] lg:py-[24px]"
      }
    >
      <h3 className="pb-4 font-bold">
        هزینه درخواست
        <span className="text-[13px]"> (ریال)</span>
      </h3>

      <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex w-full flex-col justify-between">
          <div className="flex flex-col flex-wrap gap-[14px] text-[14px] md:flex-row md:gap-10">
            <div className="flex flex-row flex-wrap gap-2 md:flex-col">
              <span className="whitespace-nowrap font-[500] text-typography-gray">
                مجموع هزینه آزمون‌ها
              </span>
              <span className="whitespace-nowrap pr-[6px] md:pr-[1px]">
                {Number(request?.price_wod)?.toLocaleString()}
                {/* <span className="mr-1 text-[12px] font-[400]">(ریال)</span> */}
              </span>
            </div>
            <div className="flex flex-row flex-wrap gap-2 md:flex-col">
              <span className="whitespace-nowrap font-[500] text-typography-gray">
                هزینه ارسال
              </span>
              <span className="whitespace-nowrap pr-[6px] md:pr-[1px]">
                {Number(request?.price_sample_returned)?.toLocaleString()}
                {/* {Number(0) !== 0 && (
                      <span className="mr-1 text-[12px] font-[400]">
                        (ریال)
                      </span>
                    )} */}
              </span>
            </div>
            <div className="flex flex-row gap-2 md:flex-col">
              <span className="flex flex-row gap-1 whitespace-nowrap font-[500] text-typography-gray">
                کل گرنت لبزنت
                <Tooltip message="مشاهده گرنت‌ها">
                  <SvgIcon
                    onClick={() => {
                      openModal(ModalKeys.LABSNET_GRANTS_LIST, {
                        labsnet: request?.labsnet,
                        labsnet_code1: request?.labsnet_code1,
                        labsnet_code2: request?.labsnet_code2,
                        labsnet1_obj: request?.labsnet1_obj,
                        labsnet2_obj: request?.labsnet2_obj,
                      });
                    }}
                    strokeColor={"black"}
                    className={
                      "cursor-pointer opacity-65 [&_svg]:h-[18px] [&_svg]:w-[18px]"
                    }
                  >
                    <IcEye />
                  </SvgIcon>
                </Tooltip>
              </span>
              <span className="whitespace-nowrap pr-[6px] md:pr-[1px]">
                {Number(request?.labsnet_discount)?.toLocaleString()}
                {/* {Number(0) !== 0 && (
                      <span className="mr-1 text-[12px] font-[400]">
                        (ریال)
                      </span>
                    )} */}
              </span>
            </div>
            <div className="flex flex-row gap-2 md:flex-col">
              <span className="flex flex-row gap-1 whitespace-nowrap font-[500] text-typography-gray">
                کل گرنت پژوهشی
                <Tooltip message="مشاهده گرنت‌ها">
                  <SvgIcon
                    onClick={() => {
                      openModal(ModalKeys.RESEARCH_GRANTS_LIST, {
                        grant_request1: request?.grant_request1,
                        grant_request2: request?.grant_request2,
                        grant_record1: request?.grant_request1_obj,
                        grant_record2: request?.grant_request2_obj,
                      });
                    }}
                    strokeColor={"black"}
                    className={
                      "cursor-pointer opacity-65 [&_svg]:h-[18px] [&_svg]:w-[18px]"
                    }
                  >
                    <IcEye />
                  </SvgIcon>
                </Tooltip>
              </span>
              <span className="whitespace-nowrap pr-[6px] md:pr-[1px]">
                {Number(request?.grant_request_discount)?.toLocaleString()}
                {/* {Number(request?.grant_request_discount) !== 0 && (
                  <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
                )} */}
              </span>
            </div>
            <div className="flex flex-row flex-wrap gap-2 md:flex-col">
              <span className="whitespace-nowrap font-[500] text-typography-gray">
                هزینه نهایی
              </span>
              <span className="whitespace-nowrap pr-[6px] md:pr-[1px]">
                {Number(request?.price)?.toLocaleString()}
                {/* <span className="mr-1 text-[12px] font-[400]">(ریال)</span> */}
              </span>
            </div>
            <div className="flex flex-row flex-wrap gap-2 md:flex-col">
              <span className="whitespace-nowrap font-[500] text-typography-gray">
                هزینه قابل پرداخت
              </span>
              <span className="whitespace-nowrap pr-[6px] md:pr-[1px]">
                {/* {new Intl.NumberFormat("fa-IR", { style: "decimal" })
                  .format(
                    Number(
                      request?.order_obj?.[request?.order_obj.length - 1]
                        ?.remaining_amount,
                    ),
                  )
                  ?.toLocaleString()} */}
                {/* <span className="mr-1 text-[12px] font-[400]">(ریال)</span> */}
                {Array.isArray(request?.order_obj) &&
                request?.order_obj.length > 0 &&
                request?.order_obj[request?.order_obj.length - 1]
                  ?.remaining_amount
                  ? new Intl.NumberFormat("fa-IR", { style: "decimal" })
                      .format(
                        Number(
                          request.order_obj[request.order_obj.length - 1]
                            ?.remaining_amount,
                        ),
                      )
                      ?.toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-x-3 pt-2">
            {/* disble button after 15 minutes */}
            {/* {request?.order_obj?.[0]?.created_at} */}
            {request?.has_prepayment && request?.created_at?.[0] && (
              <Button
                color="primary"
                disabled={
                  differenceInMinutes(
                    new Date(),
                    parseISO(request?.order_obj?.[0]?.created_at ?? ""),
                  ) >= 15
                }
                onClick={handlePrePaymentClick}
              >
                پرداخت هزینه پیش پرداخت
              </Button>
            )}
            {/* {request?.updated_at &&
              differenceInMinutes(new Date(), parseISO(request.updated_at)) >=
                15 && (
                <Button
                  color="primary"
                  onClick={() => {
                    setRequestId(request?.id);
                    setExperimentId(request?.experiment);
                    openModal(ModalKeys.CUSTOMER_SELECT_APPOINTMENT, {
                      experimentId: request?.experiment,
                      mode: "edit",
                    });
                  }}
                >
                  انتخاب نوبت جدید
                </Button>
              )} */}
            {
              // request.latest_status_obj?.step_obj.name ===
              //   "در انتظار پرداخت"
              request.latest_status_obj?.step_obj.name === "در انتظار پرداخت" &&
                !!request?.order_obj?.length &&
                request?.order_obj?.[0]?.order_status === "pending" && (
                  <Button color="primary" onClick={handlePaymentClick}>
                    پرداخت هزینه
                  </Button>
                )
            }
            <Button
              color="primary"
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {
                openModal(
                  ModalKeys.PARENT_REQUEST_FINANCIAL_INFO,
                  request.order_obj,
                );
              }}
            >
              اطلاعات مالی
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestCost;
