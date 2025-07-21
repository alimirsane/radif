import React, { useMemo } from "react";
import { Card } from "@kit/card";
import { ParameterType } from "@api/service/parameter/type";
import { AppointmentType } from "@api/service/appointment/type";
import { DateHandler } from "@utils/date-handler";
import { Button } from "@kit/button";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

interface AppointmentInformationProps {
  appointments_obj: Pick<
    AppointmentType,
    | "reserved_by_obj"
    | "start_time"
    | "end_time"
    | "status"
    | "date"
    | "extra_fields"
    | "reserved_by"
  >[];
  request_status: string;
}

const AppointmentInformation = (props: AppointmentInformationProps) => {
  const { appointments_obj, request_status } = props;
  // modal
  const openModal = useModalHandler((state) => state.openModal);
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
    <>
      <h2 className="mt-8 text-[19px] font-bold text-typography-gray lg:text-[22px]">
        اطلاعات نوبت
      </h2>

      <Card color={"white"} className={`lg:p-[24px]`}>
        <div className="flex flex-col gap-2 lg:flex-row">
          {appointments_obj.length === 0 ? (
            <Card
              variant="outline"
              color="white"
              className="w-[43%] items-center px-5 py-7"
            >
              نوبتی برای این آزمون رزرو نشده است.
            </Card>
          ) : (
            <>
              {appointments_obj?.map((item, index) => (
                <Card
                  key={index}
                  variant="outline"
                  color="white"
                  className="w-full items-center px-5 py-4 md:w-[43%]"
                >
                  <span className="flex flex-col items-center justify-between md:flex-row">
                    <h6 className="text-[16px] font-[700]">
                      تاریخ:
                      <span className="mr-1 text-[14px] font-normal">
                        {DateHandler.formatDate(item?.date, {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                    </h6>
                    <span className="flex flex-row gap-1 text-[16px] font-[700]">
                      وضعیت:
                      <span
                        className={`rounded-full px-4 py-[2px] ${item.status}-${item?.extra_fields?.queue_status} text-[13px]`}
                      >
                        {
                          appointmentStatus[
                            `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                          ]
                        }
                      </span>
                    </span>
                  </span>
                  <span className="flex flex-col items-center justify-between pt-4 md:flex-row">
                    <h6 className="text-[16px] font-[700]">
                      ساعت:
                      <span className="mr-1 text-[14px] font-normal">
                        {item?.end_time?.split(":")?.[0] +
                          ":" +
                          item?.end_time?.split(":")?.[1]}
                        {" - "}
                        {item?.start_time?.split(":")?.[0] +
                          ":" +
                          item?.start_time?.split(":")?.[1]}
                      </span>
                    </h6>
                    <Button
                      onClick={() => {
                        openModal(ModalKeys.CUSTOMER_CANCEL_APPOINTMENT, item);
                      }}
                      disabled={request_status !== "در انتظار اپراتور"}
                    >
                      کنسل کردن نوبت
                    </Button>
                  </span>
                </Card>
              ))}
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default AppointmentInformation;
