import { RequestType } from "@api/service/request/type";
import Badge from "@feature/kits/badge";
import { ColorTypes } from "@kit/common/color-type";
import { Status } from "@kit/status";
import { DateHandler } from "@utils/date-handler";

const TestSpecifications = (
  props: Pick<
    RequestType,
    | "experiment_obj"
    | "request_number"
    | "delivery_date"
    | "is_urgent"
    | "price"
    | "is_sample_returned"
    | "latest_status_obj"
    | "is_cancelled"
  >,
) => {
  const {
    experiment_obj,
    request_number,
    delivery_date,
    is_urgent,
    price,
    is_sample_returned,
    latest_status_obj,
    is_cancelled,
  } = props;
  return (
    <div id="ExperimentInfo">
      <h3 className="back-gray flex flex-row gap-2 pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        مشخصات آزمون
        {is_urgent && (
          <span id="print-is-urgent-badge">
            <Badge color="error" className="bg-opacity-80">
              فوری
            </Badge>
          </span>
        )}
      </h3>
      <div className="flex w-full flex-col flex-wrap gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[16px] md:flex-row md:items-center md:gap-[32px] md:px-[24px]">
        <div className="flex flex-row gap-[4px] md:flex-col">
          <span className="text-[16px] font-bold text-typography-main">
            نام آزمون
          </span>
          <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
            {" "}
            {experiment_obj?.name}
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            کد درخواست
          </span>
          <span
            className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]"
            // dir="ltr"
          >
            {request_number}
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            تاریخ دریافت نمونه
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {delivery_date
              ? DateHandler.formatDate(delivery_date, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "__"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            تاریخ پاسخ دهی
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {`${
              is_urgent
                ? experiment_obj?.estimated_urgent_result_time || "_"
                : experiment_obj?.estimated_result_time || "_"
            } روز کاری پس از دریافت نمونه`}
          </span>
        </div>
        {!!latest_status_obj && (
          <span id="print-status-badge">
            <Status
              color={latest_status_obj?.step_obj?.step_color as ColorTypes}
            >
              {latest_status_obj?.step_obj.name !== "رد شده"
                ? latest_status_obj?.step_obj.name
                : `${latest_status_obj?.step_obj.name} ${is_cancelled ? "توسط کاربر" : ""}`}
            </Status>
          </span>
        )}
        {/* <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            تعرفه آزمون
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {(
              Number(price) - (is_sample_returned ? 850000 : 0)
            )?.toLocaleString()}

            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        {is_sample_returned && (
          <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
            <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
              هزینه ارسال
            </span>
            <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
              850,000
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </div>
        )} */}
        {/* {is_urgent && (
          <span id="print-is-urgent-badge">
            <Badge color="error">فوری</Badge>
          </span>
        )} */}
      </div>
    </div>
  );
};

export default TestSpecifications;
