import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiAppointment } from "@api/service/appointment";
import { DateHandler } from "@utils/date-handler";
import { routes } from "@data/routes";
import { apiRequest } from "@api/service/request";
import { differenceInHours, format, parseISO } from "date-fns";

const CancelAppointment = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();

  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const modalData = useModalHandler((state) => state.modalData);
  // today
  const today = new Date();
  const appointmentDateTime = parseISO(
    `${modalData.date}T${modalData.start_time}`,
  );
  // calculate the time interval between the present and the start time of the appointment
  const hoursUntilAppointment = differenceInHours(appointmentDateTime, today);
  // cancel request
  const { mutateAsync: cancelByCustomer } = useMutation(
    apiRequest(false).cancelByCustomer(modalData?.request ?? -1),
  );
  const cancelRequestByCustomer = () => {
    const data = {
      is_cancelled: true,
    };
    cancelByCustomer(data)
      .then((res) => {
        if (router.pathname === routes.customerAppointments()) {
          clientQuery.invalidateQueries({
            queryKey: [apiAppointment().url],
          });
          router.query.action = "delete";
          router.push(router);
        } else if (router.pathname.includes(routes.customerRequestsList())) {
          clientQuery.invalidateQueries({
            queryKey: [apiRequest().url],
          });
        }
      })
      .catch((err) => {});
  };
  // update request status to rejected
  const { mutateAsync: updateRequestStatus } = useMutation(
    apiRequest(false).updateRequestStatus(modalData?.request ?? -1),
  );
  const rejectHandler = () => {
    const data = {
      description: "بدلیل کنسل کردن نوبت، درخواست لغو شده است.",
      action: "reject",
    };
    updateRequestStatus(data)
      .then((res) => {
        cancelRequestByCustomer();
      })
      .catch((err) => {});
  };
  // delete appointment api
  const { mutateAsync } = useMutation(
    apiAppointment(true, {
      success: "لغو نوبت موفقیت آمیز بود",
      fail: "لغو نوبت انجام نشد",
      waiting: "در حال انتظار",
    }).deleteAppointment(modalData?.id),
  );

  const cancelAppointmentHandler = () => {
    mutateAsync(modalData?.id)
      .then((res) => {
        // refetch data
        if (
          router.pathname === routes.customerAppointments() ||
          router.pathname.includes(routes.customerRequestsList())
        ) {
          rejectHandler();
        } else {
          clientQuery.invalidateQueries({
            queryKey: [apiRequest().url],
          });
        }
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">کنسل کردن نوبت</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {hoursUntilAppointment < 24 &&
      !router.pathname.includes(routes.customerRequest()) ? (
        <Card
          color={"info"}
          className=" mt-7 px-4 py-7 text-center text-[14px]"
        >
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به کنسل کردن نوبت‌ &quot;
            {` ساعت ${
              modalData?.end_time.split(":")?.[0] +
              ":" +
              modalData?.end_time.split(":")?.[1]
            }
                       - 
                      ${
                        modalData?.start_time.split(":")?.[0] +
                        ":" +
                        modalData?.start_time.split(":")?.[1]
                      } تاریخ ${DateHandler.formatDate(modalData.date ?? "", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })} `}
            &quot; نمی‌باشید.
          </p>
          مهلت کنسل کردن نوبت، تا 24 ساعت قبل از زمان نوبت است.
        </Card>
      ) : (
        <>
          <Card
            color={"info"}
            className="mb-8 mt-7 px-4 py-7 text-center text-[14px]"
          >
            آیا از کنسل کردن نوبت &quot;
            {` ساعت ${
              modalData?.end_time.split(":")?.[0] +
              ":" +
              modalData?.end_time.split(":")?.[1]
            }
                       - 
                      ${
                        modalData?.start_time.split(":")?.[0] +
                        ":" +
                        modalData?.start_time.split(":")?.[1]
                      } تاریخ ${DateHandler.formatDate(modalData.date ?? "", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })} `}
            &quot; اطمینان دارید؟
          </Card>
          <div className="flex justify-center gap-[12px] pb-1">
            <Button className="w-[100px]" variant="outline" onClick={hideModal}>
              خیر
            </Button>
            <Button className="w-[100px]" onClick={cancelAppointmentHandler}>
              بله
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default CancelAppointment;
