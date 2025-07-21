import React from "react";

import { Card } from "@kit/card";
import Badge from "@feature/kits/badge";
import { DateHandler } from "@utils/date-handler";
import { RequestType } from "@api/service/request/type";

const Details = ({ request }: { request: RequestType | undefined }) => {
  return (
    <Card
      variant={"outline"}
      className={
        "mt-[16px] h-full px-[26px] pb-[18px] pt-[30px] text-typography-main md:mt-0"
      }
    >
      <div className="flex flex-col pb-[12px] text-[16px]">
        <span className="flex flex-row items-center justify-center gap-2 rounded-[8px] bg-background-paper py-[12px]">
          <h6 className="flex flex-row gap-2 text-[15px] font-bold">
            <span>کد درخواست: </span>
            {request?.request_number}
          </h6>
        </span>
      </div>
      <div className="hidden border-b-[1px] border-common-black/10 lg:block">
        <div className="flex w-full flex-row justify-between gap-5 overflow-x-auto whitespace-nowrap pb-3 text-center text-[15px] font-bold text-common-gray lg:gap-0">
          <span className="w-full border-common-black/10 lg:w-[40%] lg:border-l-[1px]">
            آزمون
          </span>
          <span className="w-full border-common-black/10 lg:w-[20%] lg:border-l-[1px]">
            تاریخ نوبت
          </span>
          <span className="w-full border-common-black/10 lg:w-[20%] lg:border-l-[1px]">
            ساعت نوبت
          </span>
          <span className="w-full lg:w-[20%]">
            هزینه پیش پرداخت
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
      </div>
      {/* filter canceled requests */}
      {request?.child_requests
        ?.filter(
          (child) => child?.latest_status_obj?.step_obj?.name !== "رد شده",
        )
        ?.map((child, index) => (
          <div key={index} className={`flex flex-col`}>
            {child?.appointments_obj?.map((item, subindex) => (
              <div
                key={subindex}
                className={`flex w-full justify-between border-b-[1px] border-common-black/10 py-[12px]`}
              >
                <div
                  key={index}
                  className="whitespace-wrap flex w-full flex-col flex-nowrap items-center justify-between gap-2 overflow-x-auto text-center text-[15px] lg:flex-row lg:gap-0 lg:text-[14px]"
                >
                  <span className="flex w-full flex-row items-center gap-1 border-common-black/10 lg:w-[40%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      آزمون:
                    </span>
                    {child?.experiment_obj?.name}

                    {child?.is_urgent && <Badge color="error">فوری</Badge>}
                  </span>
                  <span className="flex w-full justify-start border-common-black/10 lg:w-[20%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      تاریخ نوبت:
                    </span>
                    {DateHandler.formatDate(item?.date, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex w-full justify-start border-common-black/10 lg:w-[20%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      ساعت نوبت:
                    </span>
                    {item?.end_time?.split(":")?.[0] +
                      ":" +
                      item?.end_time?.split(":")?.[1]}
                    {" - "}
                    {item?.start_time?.split(":")?.[0] +
                      ":" +
                      item?.start_time?.split(":")?.[1]}
                  </span>
                  <span className="flex w-full justify-start lg:w-[20%] lg:justify-center">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      هزینه پیش پرداخت:
                    </span>
                    {Number(
                      child?.experiment_obj?.prepayment_amount,
                    ).toLocaleString()}
                    <span className="mr-1 font-medium lg:hidden">ریال</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      <div className="flex flex-col justify-between border-t-[3px] border-common-black/10 text-center text-[15px] font-bold">
        <div className="flex w-full flex-row py-3">
          <span className="hidden w-[60%] border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="w-full border-l-[1px] border-common-black/10 text-common-gray lg:w-[20%]">
            مجموع پیش پرداخت‌ها
          </span>
          <span className="w-full lg:w-[20%]">
            {Number(request?.total_prepayment_amount ?? 50000).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Details;
