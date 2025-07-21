import { RequestType } from "@api/service/request/type";

const FinancialInfo = (
  props: Pick<RequestType, "price" | "price_sample_returned" | "price_wod">,
) => {
  const { price, price_sample_returned, price_wod } = props;
  return (
    <div className="mt-[20px] flex w-full flex-col items-center gap-[12px] rounded-[8px] border-[1px] border-common-black/10 bg-common-white p-[16px] md:flex-row md:gap-[40px] lg:justify-center">
      <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
        <span className="text-nowrap pb-1 text-[14px]">
          مجموع تعرفه آزمون‌ها
        </span>
        <span className="text-nowrap text-center text-[16px] font-bold">
          {/* {(Number(price) - Number(price_sample_returned)).toLocaleString()}{" "} */}
          {Number(price_wod).toLocaleString()} ریال
        </span>
      </div>
      <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
      <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
        <span className="text-nowrap pb-1 text-[14px]">هزینه ارسال</span>
        <span className="text-nowrap text-center text-[16px] font-bold">
          {Number(price_sample_returned).toLocaleString()} ریال
        </span>
      </div>
      <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
      <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
        <span className="text-nowrap pb-1 text-[14px]">
          هزینه نهایی درخواست
        </span>
        <span className="text-nowrap text-center text-[16px] font-bold">
          {Number(price).toLocaleString()} ریال
        </span>
      </div>
    </div>
  );
};

export default FinancialInfo;
