import { Card } from "@kit/card";
import { RequestType } from "@api/service/request/type";
import { DateHandler } from "@utils/date-handler";
import Badge from "@feature/kits/badge";

const PriceInformation = (
  props: Pick<
    RequestType,
    | "discount"
    | "price"
    | "price_sample_returned"
    | "price_wod"
    | "experiment_obj"
  >,
) => {
  const { discount, price, price_wod, price_sample_returned, experiment_obj } =
    props;
  return (
    <div className="mt-[32px]">
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-[19px] font-bold text-typography-gray lg:text-[22px]">
          اطلاعات هزینه آزمون
        </h2>
      </div>
      <Card color={"white"} className="py-3 text-typography-main lg:p-[24px]">
        <div className="flex w-full flex-col items-center gap-3 overflow-x-auto rounded-[8px] border-[1px] border-common-black/10 bg-common-white p-[16px] md:flex-row md:justify-center md:gap-[40px]">
          <div className="flex flex-col items-center">
            <span className="text-nowrap pb-1 text-[14px]">تعرفه آزمون</span>
            <span className="text-nowrap text-center text-[16px] font-bold">
              {Number(price_wod)?.toLocaleString()}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </div>
          {/* <div className="h-[40px] w-[1px] bg-common-black/15" />
          <div className="flex flex-col">
            <span className="text-nowrap pb-1 text-[14px]">هزینه ارسال</span>
            <span className="text-nowrap text-center text-[16px] font-bold">
              {Number(price_sample_returned)?.toLocaleString()}
              {Number(price_sample_returned) !== 0 && (
                <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
              )}
            </span>
          </div>
          <div className="h-[40px] w-[1px] bg-common-black/15" />
          <div className="flex flex-col">
            <span className="text-nowrap pb-1 text-[14px]">مجموع هزینه‌ها</span>
            <span className="text-nowrap text-center text-[16px] font-bold">
              {(
                Number(price_wod) + Number(price_sample_returned)
              )?.toLocaleString()}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </div> */}
          <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
          <div className="flex flex-col items-center">
            <span className="text-nowrap pb-1 text-[14px]">میزان تخفیف</span>
            <span className="text-nowrap text-center text-[16px] font-bold">
              {discount}
              {!!discount && (
                <span className="mr-1 text-[12px] font-[400]">درصد</span>
              )}
            </span>
          </div>
          <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
          <div className="flex flex-col items-center">
            <span className="text-nowrap pb-1 text-[14px]">
              هزینه نهایی آزمون
            </span>
            <span className="text-nowrap text-center text-[16px] font-bold">
              {Number(price)?.toLocaleString()}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </div>
          {experiment_obj?.need_turn && (
            <>
              <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
              <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
                <span className="text-nowrap pb-1 text-[14px]">
                  هزینه پیش پرداخت
                </span>
                <span className="text-nowrap text-center text-[16px] font-bold">
                  {parseInt(
                    experiment_obj?.prepayment_amount ?? "0",
                  ).toLocaleString()}{" "}
                  ریال
                </span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PriceInformation;
