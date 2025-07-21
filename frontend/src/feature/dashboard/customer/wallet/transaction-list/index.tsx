import { useMemo } from "react";

import { Card } from "@kit/card";
import { Status } from "@kit/status";
import { ColorTypes } from "@kit/common/color-type";

const TransactionList = () => {
  // sample data
  const walletTransactionList = useMemo(() => {
    return [
      {
        amount: 250000,
        status: "success",
        transaction_id: "6234329-10",
        date: "1403/2/18",
      },
      {
        amount: 7000000,
        status: "success",
        transaction_id: "6277329-11",
        date: "1403/2/18",
      },
      {
        amount: 10000,
        status: "error",
        transaction_id: "62341029-12",
        date: "1403/2/17",
      },
      {
        amount: 360000,
        status: "success",
        transaction_id: "6234329-13",
        date: "1403/2/16",
      },
    ];
  }, []);
  return (
    <div>
      <h2 className="my-3 text-[18px] font-bold">لیست تراکنش‌های کیف پول</h2>
      <div className="mb-3 flex w-full flex-nowrap justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] bg-background-paper-dark p-7 font-bold lg:gap-2 lg:whitespace-normal">
        <div className="w-full lg:w-[28%]">مبلغ تراکنش</div>
        <div className="w-full lg:w-[28%]">شماره تراکنش</div>
        <div className="w-full lg:w-[28%]">تاریخ تراکنش</div>
        <div className="w-full lg:w-[16%]"></div>
      </div>
      {walletTransactionList.map((transaction, index) => (
        <Card
          key={index}
          color={"white"}
          variant={"outline"}
          className="mb-3 flex w-full flex-nowrap items-center justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] p-6 text-[14px] lg:gap-2 lg:whitespace-normal"
        >
          <div className="w-full lg:w-[28%]">
            <p className="text-[15px] font-bold">
              {transaction.amount.toLocaleString()}
              <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
            </p>
          </div>
          <div className="w-full text-[14px] lg:w-[28%]">
            {transaction.transaction_id}
          </div>
          <div className="w-full text-[14px] lg:w-[28%]">
            {transaction.date}
          </div>
          <div className="w-full lg:w-[16%]">
            <Status color={transaction.status as ColorTypes}>
              {transaction.status === "success" ? "موفق" : "ناموفق"}
            </Status>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
