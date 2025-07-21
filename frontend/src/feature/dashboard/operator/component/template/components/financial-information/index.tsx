import React, { useMemo } from "react";
import Tooltip from "@kit/tooltip";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import Badge from "@feature/kits/badge";
import { DateHandler } from "@utils/date-handler";
import { PaymentType } from "@api/service/request/type";
import { IcEdit, IcPlus } from "@feature/kits/common/icons";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const FinancialInformation = (props: {
  price: number | undefined;
  paymentData: any[] | undefined;
  is_returned: boolean;
  payerId: number | undefined;
  orderId: number | undefined;
  requestStatus: string | undefined;
  isOnlyOperator?: boolean;
}) => {
  const {
    paymentData,
    is_returned,
    payerId,
    orderId,
    requestStatus,
    price,
    isOnlyOperator,
  } = props;
  const openModal = useModalHandler((state) => state.openModal);
  const settlementTypes = useMemo(() => {
    return [
      { value: "cash", name: "نقدی" },
      { value: "pos", name: "کارتخوان" },
      { value: "iopay", name: "درگاه پرداخت داخلی" },
      { value: "eopay", name: "درگاه پرداخت خارجی" },
    ];
  }, []);

  return (
    <div id="FinancialInfo">
      <h3 className="back-gray flex flex-row gap-2 pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        اطلاعات مالی
        {is_returned && (
          <span id="print-is-returned-badge">
            <Badge color="error" className="py-[5px]">
              استرداد شده
            </Badge>
          </span>
        )}
      </h3>
      {!paymentData?.length ? (
        <div className="mb-2 rounded-[8px] bg-background-paper-light px-4 py-[24px] text-[14px] lg:px-[24px]">
          <p>برای این درخواست هنوز هیچ پرداختی انجام نشده است.</p>
        </div>
      ) : (
        paymentData?.map((item, index) => (
          <div
            key={index}
            className="mb-2 flex w-full flex-col gap-4 rounded-[8px] bg-background-paper-light px-4 py-[16px] md:gap-2 lg:flex-row lg:items-center lg:px-[24px]"
          >
            <div className="flex w-full flex-row gap-[4px] lg:w-[16%] lg:flex-col">
              <span className="text-[16px] font-bold text-typography-main">
                مبلغ تراکنش
              </span>
              <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
                {/* {item.amount.toLocaleString()} */}
                {new Intl.NumberFormat("fa-IR", { style: "decimal" }).format(
                  Number(item.amount),
                )}
                <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
              </span>
            </div>
            <div className="flex w-full flex-row gap-[4px] lg:w-[13%] lg:flex-col">
              <span className="text-[16px] font-bold text-typography-main">
                کد مرجع
              </span>
              <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
                {item.transaction_code}
              </span>
            </div>
            <div className="flex w-full flex-row gap-[4px] lg:w-[18%] lg:flex-col">
              <span className="text-[16px] font-bold text-typography-main">
                {/* کد مرجع بانک */}
                شماره تراکنش
              </span>
              <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
                {!!item.tref ? item.tref : "---"}
              </span>
            </div>
            <div className="flex w-full flex-row gap-[4px] lg:w-[17%] lg:flex-col">
              <span className="text-[16px] font-bold text-typography-main">
                تاریخ تراکنش
              </span>
              <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
                {item.created_at
                  ? DateHandler.formatDate(item.created_at, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"}
              </span>
            </div>
            <div className="flex w-full flex-row gap-[4px] lg:w-[22%] lg:flex-col">
              <span className="text-[16px] font-bold text-typography-main">
                نوع تراکنش
              </span>
              <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
                {
                  settlementTypes.find(
                    (type) => type.value === item.settlement_type,
                  )?.name
                }
              </span>
            </div>

            <div className="flex w-full flex-row lg:w-[22%] lg:justify-center lg:gap-2">
              <span></span>
              <span
                id="print-status-badge"
                className={`whitespace-nowrap rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${item.successful ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
              >
                {item.successful ? "موفق" : "ناموفق"}
              </span>
              {item.payment_type === "prepayment" && (
                <span
                  id="print-status-badge"
                  className={`whitespace-nowrap rounded-full bg-info bg-opacity-80 px-4 py-1 text-[12px] text-common-white`}
                >
                  پیش پرداخت
                </span>
              )}
            </div>
            {(requestStatus === "در ‌انتظار پذیرش" ||
              requestStatus === "در انتظار پرداخت") && (
              <div
                id="edit-request-transaction"
                className="flex w-full flex-row justify-end lg:w-[6%]"
              >
                <AccessLevel module={"paymentrecord"} permission={["update"]}>
                  <Tooltip message="ویرایش">
                    <SvgIcon
                      onClick={() => {
                        if (item.is_lock) return;
                        openModal(ModalKeys.EDIT_PAYMENT_RECORD, {
                          transaction: item,
                          price: price,
                        });
                      }}
                      strokeColor={"primary"}
                      className={`${item.is_lock ? "cursor-not-allowed opacity-55" : "cursor-pointer"} [&_svg]:h-[24px] [&_svg]:w-[24px]`}
                    >
                      <IcEdit />
                    </SvgIcon>
                  </Tooltip>
                </AccessLevel>
              </div>
            )}
          </div>
        ))
      )}
      <div className="mb-2 flex w-full flex-col items-center justify-between gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[23px] lg:flex-row lg:items-center lg:gap-[40px] lg:px-[24px]">
        <div
          id="request-total-transaction"
          className="flex w-full flex-row gap-[4px]"
        >
          <span className="text-[16px] font-bold text-typography-main">
            مجموع تراکنش‌های موفق:
          </span>
          <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
            {paymentData
              ? Number(
                  paymentData
                    ?.filter((payment) => payment.successful)
                    ?.reduce((sum, payment) => sum + Number(payment.amount), 0),
                ).toLocaleString()
              : 0}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        {(requestStatus === "در ‌انتظار پذیرش" ||
          requestStatus === "در انتظار پرداخت") && (
          <div
            id="add-request-transaction"
            className="flex w-full flex-row justify-center lg:justify-end"
          >
            <Button
              color="primary"
              onClick={() =>
                openModal(ModalKeys.CREATE_PAYMENT_RECORD, {
                  orderId: orderId,
                  payerId: payerId,
                  price: price,
                })
              }
              startIcon={
                <SvgIcon
                  fillColor={"white"}
                  className={"[&_svg]:h-[17px] [&_svg]:w-[17px]"}
                >
                  <IcPlus />
                </SvgIcon>
              }
              disabled={isOnlyOperator}
            >
              اضافه کردن تراکنش جدید
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInformation;
