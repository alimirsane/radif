import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { AppointmentType } from "@api/service/appointment/type";
import { DateHandler } from "@utils/date-handler";
import { useMemo } from "react";

const AppointmentsInfo = () => {
  const hideModal = useModalHandler((state) => state.hideModal);
  const modalData = useModalHandler((state) => state.modalData);
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
    <Card
      color={"white"}
      className="2xl:w-[30vw] w-[80vw] p-6 sm:w-[55vw] xl:w-[40vw]"
    >
      <span className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">
          نوبت‌های آزمون {modalData?.experiment_name}
        </h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="flex flex-col gap-4">
        {modalData?.appointments_obj?.map(
          (item: AppointmentType, index: number) => (
            <Card
              key={index}
              variant="outline"
              className="grid items-center gap-2 p-4 md:grid-cols-3"
            >
              <span>
                <span className="pl-1 font-[500] text-typography-gray">
                  تاریخ:
                </span>

                {DateHandler.formatDate(item?.date, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </span>
              <span>
                <span className="pl-1 font-[500] text-typography-gray">
                  ساعت:
                </span>
                {item?.end_time?.split(":")?.[0] +
                  ":" +
                  item?.end_time?.split(":")?.[1]}
                {" - "}
                {item?.start_time?.split(":")?.[0] +
                  ":" +
                  item?.start_time?.split(":")?.[1]}
              </span>
              <span className="flex justify-end">
                <span
                  className={`mr-2 rounded-full px-3 py-[2px] ${item.status}-${item?.extra_fields?.queue_status} text-[12px]`}
                >
                  {
                    appointmentStatus[
                      `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                    ]
                  }
                </span>
              </span>
            </Card>
          ),
        )}
      </div>
    </Card>
  );
};

export default AppointmentsInfo;
