import { useEffect, useMemo } from "react";

import { Card } from "@kit/card";
import { useQuery } from "@tanstack/react-query";
import { DateHandler } from "@utils/date-handler";
import { apiAppointment } from "@api/service/appointment";
import Container from "@feature/dashboard/common/container";
import { Button } from "@kit/button";
import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcCloseCircle, IcEdit } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { useRouter } from "next/router";
import { Status } from "@kit/status";
import { useCurrentRequestHandler } from "@hook/current-request-handler";

const Appointments = () => {
  const router = useRouter();
  const openModal = useModalHandler((state) => state.openModal);
  // get current request id
  const { requestId, setRequestId, experimentId, setExperimentId } =
    useCurrentRequestHandler();
  // get appointments
  const {
    data: appointmentsList,
    isLoading: appointmentsLoading,
    refetch: refetchAppointmentsList,
  } = useQuery({
    ...apiAppointment().getOwnedAppointments({}),
  });

  useEffect(() => {
    refetchAppointmentsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (router.query.action === "delete") {
      refetchAppointmentsList();
      delete router.query.action;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
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
      <Container>
        <Card
          id="transaction-operator"
          color="white"
          variant={"outline"}
          className="flex flex-col items-center px-3 py-7 sm:px-10"
        >
          <header className="justify-right w-full">
            <h6 className="text-[18px] font-bold">نوبت‌ها</h6>
            <p className="pb-6 pt-2 text-[14px]">
              در این بخش می‌توانید جزئیات نوبت‌های ثبت شده خود را مشاهده کنید.
            </p>
          </header>
          {!appointmentsList?.data?.length && (
            <Card color="info" className="w-full p-7 text-center text-[14px]">
              <p>شما هنوز هیچ نوبتی ثبت نکرده‌اید.</p>
            </Card>
          )}
          {!!appointmentsList?.data?.length && (
            <>
              <div className="mb-3 flex w-full flex-nowrap justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] bg-background-paper-dark p-7 font-bold lg:gap-2 lg:whitespace-normal">
                <div className="w-full lg:w-[28%]">آزمون</div>
                <div className="w-full lg:w-[12%]">شماره درخواست</div>
                <div className="w-full lg:w-[13%]">وضعیت درخواست</div>
                <div className="w-full lg:w-[11%]">زمان اخذ نوبت</div>
                <div className="w-full lg:w-[9%]">تاریخ نوبت</div>
                <div className="w-full lg:w-[10%]">ساعت نوبت</div>
                <div className="w-full lg:w-[12%]">وضعیت نوبت</div>
                <div className="flex w-full justify-center lg:w-[5%]">
                  اقدامات
                </div>
              </div>
              {appointmentsList?.data.map((item, index) => (
                <Card
                  key={index}
                  color={"white"}
                  variant={"outline"}
                  className="mb-3 flex w-full flex-nowrap items-center justify-between  gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] p-6 text-[14px] lg:gap-2 lg:overflow-x-visible lg:whitespace-normal"
                >
                  <div className="w-full lg:w-[28%]">
                    {item?.extra_fields?.experiment_name}
                  </div>
                  <div className="w-full lg:w-[12%]">
                    {item?.extra_fields?.request_parent_number ?? "---"}
                  </div>
                  <div className="w-full lg:w-[13%]">
                    {/* {item.has_prepayment ? (
              <Status className="mr-auto lg:mr-0" color="pending">
                در انتظار پیش پرداخت
              </Status>
            ) : */}
                    <Status color={item?.request_status?.step_color}>
                      {item?.request_status?.name}
                    </Status>
                    {/* } */}
                  </div>
                  <div className="w-full text-common-gray lg:w-[11%]">
                    {DateHandler.formatDate(item.reserved_at ?? "", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  <div className="w-full lg:w-[9%]">
                    {DateHandler.formatDate(item.date ?? "", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  <div className="w-full lg:w-[10%]">
                    {item?.end_time.split(":")?.[0] +
                      ":" +
                      item?.end_time.split(":")?.[1]}
                    {" - "}
                    {item?.start_time.split(":")?.[0] +
                      ":" +
                      item?.start_time.split(":")?.[1]}
                  </div>
                  <div className={`w-full lg:w-[12%]`}>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-[2px] ${item.status}-${item?.extra_fields?.queue_status}`}
                    >
                      {
                        appointmentStatus[
                          `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                        ]
                      }
                    </span>
                  </div>
                  <div
                    className={`flex w-full flex-row justify-center gap-2 lg:w-[5%]`}
                  >
                    {/* <Tooltip message="ویرایش نوبت">
                      <SvgIcon
                        onClick={() => {
                          if (
                            item?.request_status?.name !== "در انتظار اپراتور"
                          )
                            return;
                          setRequestId(item?.extra_fields?.request_id);
                          // setExperimentId(request?.data?.experiment);
                          openModal(ModalKeys.CUSTOMER_SELECT_APPOINTMENT, {
                            // experimentId: request?.data?.experiment,
                            mode: "edit",
                          });
                        }}
                        strokeColor={"primary"}
                        className={`${
                          item?.request_status?.name !== "در انتظار اپراتور"
                            ? "cursor-not-allowed opacity-45"
                            : "cursor-pointer"
                        } [&_svg]:h-[30px] [&_svg]:w-[30px]`}
                      >
                        <IcEdit />
                      </SvgIcon>
                    </Tooltip> */}
                    <Tooltip message="کنسل کردن نوبت">
                      <SvgIcon
                        onClick={() => {
                          if (
                            item?.request_status?.name !== "در انتظار اپراتور"
                          )
                            return;
                          openModal(
                            ModalKeys.CUSTOMER_CANCEL_APPOINTMENT,
                            item,
                          );
                        }}
                        fillColor={"primary"}
                        className={`${
                          item?.request_status?.name !== "در انتظار اپراتور"
                            ? "cursor-not-allowed opacity-45"
                            : "cursor-pointer"
                        } [&_svg]:h-[22px] [&_svg]:w-[22px]`}
                      >
                        <IcCloseCircle />
                      </SvgIcon>
                    </Tooltip>
                  </div>
                </Card>
              ))}
            </>
          )}
        </Card>
      </Container>
    </>
  );
};

export default Appointments;
