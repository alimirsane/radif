import React from "react";
import {
  IcCash,
  IcCreditCardFront,
  IcFiles,
  IcReceipt,
} from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { RequestType } from "@api/service/request/type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const ParentActions = (props: {
  request: RequestType | undefined;
  requestId: number | undefined;
  requestPrintOnClick: () => void;
  financialInvoicePrintOnClick: () => void;
  customerInvoicePrintOnClick: () => void;
  isOnlyOperatorOrTechnical: boolean;
}) => {
  const {
    request,
    requestId,
    requestPrintOnClick,
    financialInvoicePrintOnClick,
    customerInvoicePrintOnClick,
    isOnlyOperatorOrTechnical,
  } = props;
  const openModal = useModalHandler((state) => state.openModal);

  const printHandler = () => {
    // we add this line to fix the negetive margin, when user scroll to bottom of page and then click on print button
    window.scrollTo(0, 0);
    window.print();
  };

  const handlePayment = () => {
    openModal(ModalKeys.REQUEST_TREF_CODE, {
      requestId: requestId,
      buyer: request?.owner,
      orderId: request?.order_obj?.[0]?.id.toString(),
      amount: request?.price,
    });
  };

  return (
    <div
      id="PageActions"
      className="flex h-fit w-full flex-col items-center gap-[12px] rounded-[8px] bg-background-paper-light p-[24px] md:flex-row md:items-start"
    >
      <Button
        variant="outline"
        color="primary"
        onClick={requestPrintOnClick}
        startIcon={
          <SvgIcon
            fillColor="primary"
            className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
          >
            <IcFiles />
          </SvgIcon>
        }
        className="w-full text-primary md:w-auto"
      >
        چاپ درخواست
      </Button>

      {request?.latest_status_obj?.step_obj?.name !== "رد شده" && (
        <Button
          variant="outline"
          color="info"
          onClick={financialInvoicePrintOnClick}
          startIcon={
            <SvgIcon
              fillColor="info"
              className={"[&_svg]:w-18px] [&_svg]:h-[18px]"}
            >
              <IcReceipt />
            </SvgIcon>
          }
          className="w-full text-info md:w-auto"
        >
          {
            // !request?.order_obj?.length ||
            // request?.order_obj[0].order_status === "pending"
            request?.latest_status_obj?.step_obj?.name ===
              "در انتظار اپراتور" ||
            request?.latest_status_obj?.step_obj?.name === "در ‌انتظار پذیرش" ||
            request?.latest_status_obj?.step_obj?.name === "در انتظار پرداخت"
              ? "پیش فاکتور"
              : "صورت حساب مالی"
          }
        </Button>
      )}
      {(request?.latest_status_obj?.step_obj?.name === "در ‌انتظار نمونه" ||
        request?.latest_status_obj?.step_obj?.name === "در حال انجام" ||
        request?.latest_status_obj?.step_obj?.name === "تکمیل شده") && (
        <Button
          variant="outline"
          color="secondary"
          onClick={customerInvoicePrintOnClick}
          startIcon={
            <SvgIcon
              fillColor="secondary"
              className={"[&_svg]:w-18px] [&_svg]:h-[18px]"}
            >
              <IcReceipt />
            </SvgIcon>
          }
          className="w-full text-secondary md:w-auto"
        >
          صورت حساب مشتری
        </Button>
      )}
      {request?.latest_status_obj?.step_obj?.name === "در ‌انتظار پذیرش" &&
        !isOnlyOperatorOrTechnical && (
          <Button
            variant="outline"
            color="secondary"
            onClick={() => {
              openModal(ModalKeys.REQUEST_LABSNET_DISCOUNT, {
                requestId: request?.id,
                price:
                  request?.order_obj?.[request?.order_obj?.length - 1]
                    ?.remaining_amount,
                labsnet: request?.labsnet,
                labsnet_code1: request?.labsnet_code1,
                labsnet_code2: request?.labsnet_code2,
                labsnet1_obj: request?.labsnet1_obj,
                labsnet2_obj: request?.labsnet2_obj,
                child_requests: request?.child_requests,
                request_number: request?.request_number,
              });
            }}
            startIcon={
              <SvgIcon
                fillColor="secondary"
                className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
              >
                <IcCash />
              </SvgIcon>
            }
            className="w-full text-secondary md:w-auto"
            disabled={isOnlyOperatorOrTechnical}
          >
            میزان گرنت لبزنت
          </Button>
        )}

      {/* {request?.latest_status_obj?.step_obj
        ?.name === "در انتظار پرداخت" &&
        !isOnlyOperatorOrTechnical && (
          <Button
            variant="outline"
            color="secondary"
            onClick={handlePayment}
            startIcon={
              <SvgIcon
                fillColor="secondary"
                className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
              >
                <IcCreditCardFront />
              </SvgIcon>
            }
            className="w-full text-secondary md:w-auto"
            disabled={isOnlyOperatorOrTechnical}
          >
            ثبت کد مرجع بانک
          </Button>
        )} */}
    </div>
  );
};

export default ParentActions;
