import React, { useMemo } from "react";
import { AppointmentType } from "@api/service/appointment/type";
import { DateHandler } from "@utils/date-handler";

const RequestAppointments: React.FC<{
  appointments_obj: Pick<
    AppointmentType,
    | "reserved_by_obj"
    | "start_time"
    | "end_time"
    | "status"
    | "queue"
    | "request"
    | "reserved_by"
    | "date"
    | "extra_fields"
  >[];
}> = ({ appointments_obj }) => {
  // appointments status
  const appointmentStatus = useMemo(() => {
    return {
      "reserved-active": "رزرو شده",
      "reserved-suspended": "رزرو تعلیق شده",
      "canceled-active": "کنسل شده",
      "canceled-suspended": "کنسلی تعلیق شده",
      "pending-active": "پیش پرداخت",
      "pending-suspended": "پیش پرداخت تعلیق شده",
    };
  }, []);

  return (
    <div id="ParameterInfo">
      <h3 className="pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        نوبت انتخابی
      </h3>
      <div className="flex w-full flex-col flex-wrap gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[16px] md:flex-row md:items-center md:gap-[32px] md:px-[24px]">
        {appointments_obj?.length !== 0 ? (
          appointments_obj?.map((item, index) => (
            <>
              <div className="flex flex-row gap-[4px] md:flex-col" key={index}>
                <span className="text-[16px] font-bold">تاریخ</span>
                <span className="pr-1 text-[14px]">
                  {DateHandler.formatDate(item?.date, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex flex-row gap-[4px] md:flex-col" key={index}>
                <span className="text-[16px] font-bold">ساعت</span>
                <span className="pr-1 text-[14px]">
                  {item?.end_time?.split(":")?.[0] +
                    ":" +
                    item?.end_time?.split(":")?.[1]}
                  {" - "}
                  {item?.start_time?.split(":")?.[0] +
                    ":" +
                    item?.start_time?.split(":")?.[1]}
                </span>
              </div>
              <span
                id="print-status-badge"
                className={`mr-2 rounded-full px-3 py-[2px] ${item.status}-${item?.extra_fields?.queue_status} text-[13px]`}
              >
                {
                  appointmentStatus[
                    `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                  ]
                }
              </span>
            </>
          ))
        ) : (
          <p className="text-[14px]">نوبتی برای این آزمون رزرو نشده است.</p>
        )}
      </div>
    </div>
  );
};

export default RequestAppointments;
