import { apiPaymentRecord } from "@api/service/payment-record";
import Container from "@feature/dashboard/common/container";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import Pagination from "@kit/pagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTransactionHandler } from "@feature/dashboard/operator/transaction/transaction";
import { DateHandler } from "@utils/date-handler";
import { TransactionPrint } from "@feature/dashboard/common/transaction-print";
import Badge from "@feature/kits/badge";

const PaymentsList = () => {
  const settlementTypes = useMemo(() => {
    return [
      { value: "cash", name: "نقدی" },
      { value: "pos", name: "کارتخوان" },
      { value: "iopay", name: "درگاه پرداخت داخلی" },
      { value: "eopay", name: "درگاه پرداخت خارجی" },
    ];
  }, []);
  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  // current page
  const [currentPage, setCurrentPage] = useState(1);
  // get payment records
  const {
    data: paymentsList,
    isLoading: paymentsLoading,
    refetch: refetchPaymentsList,
  } = useQuery(
    apiPaymentRecord(false).getAllByCustomer({
      invoice_print: true,
      page: currentPage,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );
  // number of items per page
  const pageSize = paymentsList?.data?.page_size || 10;
  // number of all items
  const totalTransactions = Number(paymentsList?.data?.count) || 0;
  // total pages
  const totalPages = Math.ceil(totalTransactions / pageSize);
  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // get transactions for the current page
  const getCurrentPageTransactionsList = () => {
    if (!paymentsList) return [];
    // const startIndex = (currentPage - 1) * pageSize;
    // const endIndex = Math.min(startIndex + pageSize, totalTransactions);
    // return paymentsList.data?.results.slice(startIndex, endIndex);
    return paymentsList.data?.results;
  };

  const { transaction, setTransaction } = useTransactionHandler();

  useEffect(() => {
    if (!transaction) {
      return;
    }
    window.print();
    setTransaction(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetchPaymentsList();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchPaymentsList]);

  return (
    <>
      {transaction && (
        <TransactionPrint transaction={transaction} role={"customer"} />
      )}
      <Container>
        <Card
          id="transaction-operator"
          color="white"
          variant={"outline"}
          className="flex flex-col items-center px-3 py-7 sm:px-10"
        >
          <header className="justify-right w-full">
            <h6 className="text-[18px] font-bold">پرداخت‌ها</h6>
            <p className="pb-6 pt-2 text-[14px]">
              در این بخش می‌توانید پرداختی‌های خود را مشاهده کنید.
            </p>
          </header>
          {!getCurrentPageTransactionsList().length && (
            <Card color="info" className="w-full p-7 text-center text-[14px]">
              <p>شما هنوز هیچ پرداختی ثبت نکرده‌اید.</p>
            </Card>
          )}
          {!!getCurrentPageTransactionsList().length && (
            <>
              <div className="mb-3 flex w-full flex-nowrap justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] bg-background-paper-dark p-6 font-bold lg:gap-2 lg:whitespace-normal">
                <div className="w-full lg:w-[17%]">شماره درخواست</div>
                <div className="w-full lg:w-[10%]">تاریخ تراکنش</div>
                <div className="w-full lg:w-[11%]">مبلغ تراکنش</div>
                <div className="w-full lg:w-[11%]">شماره تراکنش</div>
                <div className="w-full lg:w-[11%]">کد مرجع</div>
                <div className="w-full lg:w-[12%]">نوع تراکنش</div>
                <div className="w-full lg:w-[8%]">استرداد شده</div>
                <div className="flex w-full justify-center lg:w-[10%]">
                  وضعیت
                </div>
                <div className="flex w-full justify-center lg:w-[10%]">
                  چاپ تراکنش
                </div>
              </div>
              {getCurrentPageTransactionsList().map((item, index) => (
                <Card
                  key={index}
                  color={"white"}
                  variant={"outline"}
                  className="mb-3 flex w-full flex-nowrap items-center justify-between  gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] p-6 text-[14px] lg:gap-2 lg:whitespace-normal"
                >
                  <div className="flex w-full flex-row gap-1 lg:w-[17%]">
                    {item?.request_obj?.request_number}
                    {item.payment_type === "prepayment" && (
                      <div>
                        <span
                          className={`whitespace-nowrap rounded-full bg-info bg-opacity-80 px-4 py-1 text-[12px] text-common-white`}
                        >
                          پیش پرداخت
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full lg:w-[10%]">
                    {item.updated_at
                      ? DateHandler.formatDate(item.updated_at, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "---"}
                  </div>
                  <div className="w-full lg:w-[11%]">
                    {item?.amount.toLocaleString()}
                    {item?.amount !== 0 && (
                      <span className="mr-1 text-[12px] font-[400]">
                        (ریال)
                      </span>
                    )}
                  </div>
                  <div className="w-full lg:w-[11%]">
                    {/* {item.transaction_code} */}
                    {item?.order_obj?.payment_record?.[0]?.tref ?? "---"}
                  </div>
                  <div className="w-full lg:w-[11%]">
                    {item?.transaction_code}
                  </div>
                  <div className="w-full lg:w-[12%]">
                    {
                      settlementTypes.find(
                        (type) => type.value === item?.settlement_type,
                      )?.name
                    }
                  </div>
                  <div className="w-full lg:w-[8%]">
                    {item?.is_returned ? "بله" : "خیر"}
                    {/* {item.is_returned ? (
                      <Badge color="error" className="py-[5px]">
                        استرداد شده
                      </Badge>
                    ) : (
                      <p>---</p>
                    )} */}
                  </div>
                  <div className="flex w-full justify-center lg:w-[10%]">
                    <span
                      className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${item?.successful ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
                    >
                      {item?.successful ? "موفق" : "ناموفق"}
                    </span>
                  </div>
                  <div className="flex w-full justify-center px-1 lg:w-[10%]">
                    {/* {item.successful && ( */}
                    <Button
                      variant="outline"
                      color="primary"
                      onClick={() => {
                        setTransaction(item);
                      }}
                    >
                      {/* {item?.order_obj?.order_status === "pending" */}
                      {/* {item?.successful &&
                      item.request_obj?.latest_status_obj?.step_obj?.name === "در ‌انتظار نمونه" */}
                      {item?.request_obj?.latest_status_obj?.step_obj?.name ===
                        "در انتظار اپراتور" ||
                      item?.request_obj?.latest_status_obj?.step_obj?.name ===
                        "در ‌انتظار پذیرش" ||
                      item?.request_obj?.latest_status_obj?.step_obj?.name ===
                        "در انتظار پرداخت"
                        ? "پیش فاکتور"
                        : "فاکتور"}
                    </Button>
                    {/* )} */}
                  </div>
                </Card>
              ))}
            </>
          )}
        </Card>
        {/* Pagination */}
        <div className="mt-8" id="transaction-operator">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Container>
    </>
  );
};

export default PaymentsList;
