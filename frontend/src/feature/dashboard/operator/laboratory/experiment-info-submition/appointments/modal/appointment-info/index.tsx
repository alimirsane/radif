import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Status } from "@kit/status";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { apiAppointment } from "@api/service/appointment";
import { useModalHandler } from "@utils/modal-handler/config";
import { differenceInHours, parseISO } from "date-fns";
import moment from "jalali-moment";
import { apiRequest } from "@api/service/request";

const AppointmentInfo = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const modalData = useModalHandler((state) => state.modalData);
  // today
  const today = new Date();
  // calculate the time interval between the present and the start time of the appointment
  const hoursUntilAppointment = differenceInHours(
    modalData.startDateTime,
    today,
  );
  // cancel confirmation
  const [displayCancelConfirmation, setDisplayCancelConfirmation] =
    useState(false);
  // update request status to rejected
  const { mutateAsync: updateRequestStatus } = useMutation(
    apiRequest(false).updateRequestStatus(modalData?.request_id ?? -1),
  );
  const rejectHandler = () => {
    const data = {
      description: "بدلیل کنسل کردن نوبت، درخواست لغو شده است.",
      action: "reject",
    };
    updateRequestStatus(data)
      .then((res) => {})
      .catch((err) => {});
  };
  // delete appointment api
  const { mutateAsync } = useMutation(
    apiAppointment(true, {
      success: "لغو نوبت موفقیت آمیز بود",
      fail: "لغو نوبت انجام نشد",
      waiting: "در حال انتظار",
    }).deleteAppointment(modalData?.appointment_id),
  );
  const cancelAppointment = () => {
    mutateAsync(modalData?.appointment_id)
      .then((res) => {
        rejectHandler();
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiAppointment().url],
        });
        router.query.action = "delete";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[55vw] xxl:w-[35vw]">
      <span className="mb-[24px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">اطلاعات نوبت‌</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="grid gap-4 pb-2 text-[14px] md:grid-cols-2">
        <div className="flex flex-row items-center gap-1 py-1">
          <span className="font-medium">تاریخ نوبت: </span>
          <span>{modalData?.date}</span>
        </div>
        <div className="flex flex-row items-center gap-1 py-1">
          <span className="font-medium">رزرو کننده: </span>
          <span>{modalData?.reservedBy}</span>
        </div>
        <div className="flex flex-row items-center gap-1 py-1">
          <span className="font-medium">ساعت نوبت: </span>
          <span>
            {modalData?.startTime} - {modalData?.endTime}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1 py-1">
          <span className="font-medium">شماره درخواست: </span>
          <span>{modalData?.request_number}</span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="font-medium">وضعیت نوبت: </span>
          <span className={`rounded-md px-2 ${modalData?.className}`}>
            {modalData?.status}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="font-medium">وضعیت درخواست: </span>
          <Status color={modalData?.request_status?.step_obj?.step_color}>
            {modalData?.request_status?.step_obj?.name}
          </Status>
        </div>
      </div>
      <div
        className="mt-3 flex justify-end border-t border-typography-secondary border-opacity-35 pb-1 pt-7
      "
      >
        {displayCancelConfirmation ? (
          hoursUntilAppointment < 24 ? (
            <span className="w-full">
              {" "}
              <Card
                color={"info"}
                className="px-4 py-7 text-center text-[14px]"
              >
                <p className="pb-3 text-[15px] font-medium">
                  شما مجاز به کنسل کردن این نوبت‌ نمی‌باشید.
                </p>
                مهلت کنسل کردن نوبت، تا 24 ساعت قبل از زمان نوبت است.
              </Card>
            </span>
          ) : (
            <span className="w-full">
              <Card
                color={"info"}
                className="mb-7 px-4 py-7 text-center text-[14px]"
              >
                آیا از لغو این نوبت اطمینان دارید؟
              </Card>
              <div className="flex justify-center gap-[12px] pb-1">
                <Button
                  className="w-[100px]"
                  variant="outline"
                  onClick={() => setDisplayCancelConfirmation(false)}
                >
                  خیر
                </Button>
                <Button className="w-[100px]" onClick={cancelAppointment}>
                  بله
                </Button>
              </div>
            </span>
          )
        ) : (
          <Button onClick={() => setDisplayCancelConfirmation(true)}>
            کنسل کردن نوبت
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AppointmentInfo;
