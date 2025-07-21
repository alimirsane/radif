import { Card } from "@kit/card";
import { DateHandler } from "@utils/date-handler";
import { PaymentType } from "@api/service/request/type";
import { OrderType } from "@api/service/order/type";
import { useMemo } from "react";

const FinancialInformation = ({
  paymentRecords,
}: {
  paymentRecords: OrderType[] | undefined;
}) => {
  const settlementTypes = useMemo(() => {
    return [
      { value: "cash", name: "نقدی" },
      { value: "pos", name: "کارتخوان" },
      { value: "iopay", name: "درگاه پرداخت داخلی" },
      { value: "eopay", name: "درگاه پرداخت خارجی" },
    ];
  }, []);
  return (
    <div>
      {!paymentRecords?.[0]?.payment_record?.length ? (
        <Card color={"info"} className="mb-3">
          <p className="p-x-4 py-6 text-center text-[14px]">
            برای این درخواست هنوز هیچ پرداختی انجام نشده است.
          </p>
        </Card>
      ) : (
        <Card color={"white"} className="pb-3">
          <div className="mb-3 flex w-full flex-nowrap justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] bg-background-paper p-7 font-bold lg:gap-2 lg:whitespace-normal">
            <div className="w-full lg:w-[25%]">مبلغ تراکنش</div>
            <div className="w-full lg:w-[16%]">کد تراکنش</div>
            <div className="w-full lg:w-[15%]">کد مرجع</div>
            <div className="w-full lg:w-[18%]">نوع تراکنش</div>
            <div className="w-full lg:w-[16%]">تاریخ تراکنش</div>
            <div className="w-full lg:w-[10%]">وضعیت</div>
          </div>
          {paymentRecords?.map((record, index) => (
            <span key={index}>
              {record?.payment_record?.map((item, subindex) => (
                <Card
                  key={subindex}
                  color={"white"}
                  variant={"outline"}
                  className="mb-3 flex w-full flex-nowrap items-center justify-between  gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] p-6 text-[14px] lg:gap-2 lg:whitespace-normal"
                >
                  <div className="flex w-full flex-row items-center gap-1 lg:w-[25%]">
                    {/* {item.amount.toLocaleString()} */}
                    <span>
                      {new Intl.NumberFormat("fa-IR", {
                        style: "decimal",
                      }).format(Number(item.amount))}
                      <span className="mr-1 text-[12px] font-[400]">
                        (ریال)
                      </span>
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
                  <div className="w-full lg:w-[16%]">
                    {!!item.tref ? item.tref : "---"}
                  </div>
                  <div className="w-full lg:w-[15%]">
                    {item.transaction_code}
                  </div>
                  <div className="w-full lg:w-[18%]">
                    {
                      settlementTypes.find(
                        (type) => type.value === item.settlement_type,
                      )?.name
                    }
                  </div>
                  <div className="w-full lg:w-[16%]">
                    {item.created_at
                      ? DateHandler.formatDate(item.created_at, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "---"}
                  </div>
                  <div className="w-full lg:w-[10%]">
                    <span
                      className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${item.successful ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
                    >
                      {item.successful ? "موفق" : "ناموفق"}
                    </span>
                  </div>
                </Card>
              ))}
            </span>
          ))}
          <Card
            variant="outline"
            className="flex w-full flex-row gap-[4px] bg-paper-light bg-opacity-5 px-6 py-5"
          >
            <span className="text-[16px] font-bold text-typography-main">
              مجموع تراکنش‌های موفق:
            </span>
            <span className="pr-[6px] text-[14px] text-typography-main lg:pr-[1px]">
              {paymentRecords
                ? new Intl.NumberFormat("fa-IR", {
                    style: "decimal",
                  }).format(
                    paymentRecords?.reduce((total, record) => {
                      return (
                        total +
                        (record?.payment_record?.reduce((subTotal, item) => {
                          return item.successful
                            ? subTotal + Number(item.amount)
                            : subTotal;
                        }, 0) || 0)
                      );
                    }, 0),
                  )
                : 0}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default FinancialInformation;
