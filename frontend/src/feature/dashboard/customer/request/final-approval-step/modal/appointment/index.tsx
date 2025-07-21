import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiUser } from "@api/service/user";
import { apiAppointment } from "@api/service/appointment";
import { IcAlertCircle, IcCheck, IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import {
  AppointmentStatusType,
  QueueStatusType,
} from "@api/service/appointment/type";

import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import faLocale from "@fullcalendar/core/locales/fa";
import interactionPlugin from "@fullcalendar/interaction";
import { apiRequest } from "@api/service/request";
import { useCurrentRequestHandler } from "@hook/current-request-handler";

const SelectAppointment = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();

  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get experiment Id form modal
  const modalData = useModalHandler((state) => state.modalData);
  // get current request id
  const { requestId, setRequestId, experimentId, setExperimentId } =
    useCurrentRequestHandler();

  // ******* full calendar *******
  // calendar event format:
  //   {
  //     end: "2025-01-29T14:00:00+03:30",
  //     id: "1",
  //     start: "2025-01-29T13:00:00+03:30",
  //     title: "my turn",
  //   }
  // sample events of calendar
  const turnsList = useMemo(() => {
    return [
      {
        date: "2025-02-02",
        start_time: "08:00:00",
        end_time: "09:00:00",
        status: "reserved",
      },
    ];
  }, []);

  // selected event id
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // selected event id to cancel
  const [canceledEventId, setCanceledEventId] = useState<number>(-1);

  // selected event date
  const [selectedEventDate, setSelectedEventdate] = useState<string | null>(
    null,
  );
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    date: string;
  } | null>(null);
  const [appointmentId, setAppointmentId] = useState(-1);
  // cancel appointment
  const { mutateAsync } = useMutation(
    apiAppointment(false).deleteAppointment(canceledEventId),
  );

  const cancelAppointmentHandler = () => {
    mutateAsync(canceledEventId)
      .then((res) => {
        refetchAppointmentsList();
        setSelectedEvent(null);
        setSelectedEventId(null);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (canceledEventId !== -1) cancelAppointmentHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canceledEventId]);
  // Update state with the ID of the selected event
  const handleEventClick = (clickInfo: any) => {
    // disable turns before today
    const today = new Date();

    const eventDate = new Date(clickInfo.event.start);

    if (eventDate < today) {
      return;
    }
    if (
      ((clickInfo.event.extendedProps.status ===
        AppointmentStatusType.PENDING ||
        clickInfo.event.extendedProps.status ===
          AppointmentStatusType.RESERVED) &&
        clickInfo.event.extendedProps.requestId !== requestId) ||
      clickInfo.event.extendedProps.queueStatus === QueueStatusType.INACTIVE ||
      clickInfo.event.extendedProps.queueStatus === QueueStatusType.SUSPENDED
    ) {
      return; // prevent select reserved turns
    }
    if (
      (clickInfo.event.extendedProps.status === AppointmentStatusType.PENDING ||
        clickInfo.event.extendedProps.status ===
          AppointmentStatusType.RESERVED) &&
      clickInfo.event.extendedProps.requestId === requestId
    ) {
      // set selected appointment id to cancel it
      setCanceledEventId(Number(clickInfo.event.extendedProps.appointmentId));
    }
    const clickedId = clickInfo.event.id;
    setSelectedEventId(clickedId);
    setSelectedQueueId(clickInfo.event.extendedProps.queueId);
    setSelectedEventdate(format(clickInfo.event.start, "yyyy-MM-dd"));
    setSelectedEvent({
      id: clickInfo.event.id,
      date: format(clickInfo.event.start, "yyyy-MM-dd"),
    });
  };
  // Reference to calendar
  const calendarRef = useRef<FullCalendar | null>(null);

  // start date and end date of current week
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  // selected queue
  const [selectedQueueId, setSelectedQueueId] = useState<number>(0);
  // set week date range when week is changed
  const handleDatesSet = (info: any) => {
    setDateRange({
      start: format(info.start, "yyyy-MM-dd"),
      end: format(info.end, "yyyy-MM-dd"),
    });
  };

  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(false);
  // get appointments
  const {
    data: appointmentsList,
    isLoading: appointmentsLoading,
    refetch: refetchAppointmentsList,
  } = useQuery({
    ...apiAppointment().getAllAvailable({
      start_date: dateRange.start,
      end_date: dateRange.end,
      experiment_id: modalData?.experimentId,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  });
  // get queues
  const {
    data: queuesList,
    isLoading: queuesLoading,
    refetch: refetchQueuesList,
  } = useQuery({
    ...apiAppointment().getAllQueues({
      start_date: dateRange?.start,
      end_date: dateRange?.end,
      experiment_id: modalData?.experimentId,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  });
  // fetch data every 5 seconds
  // useEffect(() => {
  //   // setDisplayLoadingOverlay(false);
  //   const interval = setInterval(async () => {
  //     try {
  //       await refetchAppointmentsList();
  //       await refetchQueuesList();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [refetchAppointmentsList, refetchQueuesList]);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startFetching = (delay: number) => {
      interval = setInterval(async () => {
        try {
          await refetchAppointmentsList();
          await refetchQueuesList();
        } catch (err) {
          console.error(err);
        }
      }, delay);
    };

    // Start fetching every 5 seconds
    startFetching(5000);

    // After 30 seconds, switch to fetching every 30 seconds
    const switchToLongInterval = setTimeout(() => {
      clearInterval(interval); // Clear the initial 5-second interval
      startFetching(30000); // Start a new interval with 30-second delay
    }, 30000);

    // Clean up intervals on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(switchToLongInterval);
    };
  }, [refetchAppointmentsList, refetchQueuesList]);

  useEffect(() => {
    refetchAppointmentsList();
    refetchQueuesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  // appointment class
  const getAppointmentClass = (
    appointmentStatus: string,
    queueStatus: string,
  ) => {
    if (
      appointmentStatus === AppointmentStatusType.FREE &&
      queueStatus === QueueStatusType.INACTIVE
    )
      return "free-inactive";
    if (
      appointmentStatus === AppointmentStatusType.FREE &&
      queueStatus === QueueStatusType.SUSPENDED
    )
      return "free-suspended";
    if (
      appointmentStatus === AppointmentStatusType.RESERVED &&
      queueStatus === QueueStatusType.ACTIVE
    )
      return "reserved-active";
    if (
      appointmentStatus === AppointmentStatusType.RESERVED &&
      queueStatus === QueueStatusType.SUSPENDED
    )
      return "reserved-suspended";
    if (
      appointmentStatus === AppointmentStatusType.CANCELED &&
      queueStatus === QueueStatusType.ACTIVE
    )
      return "canceled-active";
    if (
      appointmentStatus === AppointmentStatusType.CANCELED &&
      queueStatus === QueueStatusType.SUSPENDED
    )
      return "canceled-suspended";
    if (
      appointmentStatus === AppointmentStatusType.PENDING &&
      queueStatus === QueueStatusType.ACTIVE
    )
      return "pending-active";
    if (
      appointmentStatus === AppointmentStatusType.PENDING &&
      queueStatus === QueueStatusType.SUSPENDED
    )
      return "pending-suspended";
  };
  // convert data to calendar event format
  const formattedEvents = useMemo(() => {
    if (!appointmentsList?.data) return [];

    return appointmentsList?.data?.map((item, index) => {
      const now = new Date();
      const eventDateTime = new Date(`${item.date}T${item.start_time}`);
      const isPast = eventDateTime < now;

      return {
        id: String(index + 1),
        title:
          item.status === AppointmentStatusType.RESERVED
            ? user?.data.id === item.reserved_by
              ? item.request_id === requestId &&
                experimentId?.toString() === modalData?.experimentId?.toString()
                ? "برای لغو نوبت انتخابی کلیک کنید."
                : `رزرو شده: ${item.reserved_by_obj?.first_name} ${item.reserved_by_obj?.last_name}`
              : "رزرو شده"
            : item.status === AppointmentStatusType.PENDING
              ? user?.data.id === item.reserved_by
                ? item.request_id === requestId &&
                  experimentId?.toString() ===
                    modalData?.experimentId?.toString()
                  ? "برای لغو نوبت انتخابی کلیک کنید."
                  : `در انتظار پیش پرداخت: ${item.reserved_by_obj?.first_name} ${item.reserved_by_obj?.last_name}`
                : "در انتظار پیش پرداخت"
              : "",
        start: `${item.date}T${item.start_time}`,
        end: `${item.date}T${item.end_time}`,
        extendedProps: {
          status: item.status,
          queueStatus: queuesList?.data?.find(
            (queue) => queue.id === item.queue_id,
          )?.status,
          queueId: item.queue_id,
          requestId: item.request_id,
          appointmentId: item.appointment_id,
          className: `${getAppointmentClass(
            item.status,
            queuesList?.data?.find((queue) => queue.id === item.queue_id)
              ?.status ?? "",
          )} ${isPast ? "cursor-notAllowed opacity-75" : ""} ${
            (item.status !== AppointmentStatusType.FREE &&
              item.request_id !== requestId) ||
            queuesList?.data?.find((queue) => queue.id === item.queue_id)
              ?.status !== QueueStatusType.ACTIVE
              ? "cursor-notAllowed"
              : ""
          } ${item.request_id === requestId && experimentId?.toString() === modalData?.experimentId?.toString() ? "my-selected-turn cursor-pointer" : ""}`,
          reserved_by:
            item.reserved_by_obj?.first_name +
            " " +
            item.reserved_by_obj?.last_name,
        },
      };
    });
  }, [appointmentsList, queuesList, user, requestId, experimentId, modalData]);

  // check if this request already has reserved or pending appointmnet
  const hasReservedAppointment = useMemo(() => {
    return appointmentsList?.data?.some(
      (appointment) =>
        (appointment.status === AppointmentStatusType.RESERVED ||
          appointment.status === AppointmentStatusType.PENDING) &&
        appointment.request_id === requestId,
    );
  }, [appointmentsList, requestId]);
  // check if button is clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // request create api
  const { mutateAsync: createChildRequest } = useMutation(
    apiRequest(false).create(),
  );

  // submit selected appointment
  const { mutateAsync: selectTurn } = useMutation(
    apiAppointment(true, {
      success: "ثبت نوبت موفقیت آمیز بود",
      // fail: "ثبت نوبت انجام نشد",
      waiting: "در حال انتظار",
    }).setAppointment(),
  );
  // submit child request
  const submitchildRequest = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = modalData.serviceData;
    createChildRequest(data)
      .then((res) => {
        // set request id state
        setRequestId(res?.data.id);
        setExperimentId(modalData?.experimentId?.toString());
        submitAppointment(res?.data.id ?? -1);
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };

  // submit selected appointment
  const submitAppointment = (request_Id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      start_time:
        formattedEvents
          ?.find((event) => event.id === selectedEventId)
          ?.start.split("T")?.[1] ?? "",
      status: AppointmentStatusType.RESERVED,
      queue: selectedQueueId,
      reserved_by: user?.data.id ?? -1,
      request: Number(request_Id),
    };
    selectTurn(data)
      .then((res) => {
        // refetch data
        if (modalData?.mode === "edit") {
          clientQuery.invalidateQueries({
            queryKey: [apiRequest().url],
          });
        } else {
          router.query.exp = modalData?.experimentId?.toString();
          router.query.appt = "on";
          router.query.step = "2";
          router.push(router);
        }
        hideModal();
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };

  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[90vw] xl:w-[80vw]"
    >
      <span className="mb-5 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">انتخاب نوبت</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {modalData.appointmentDescription && (
        <Card
          color="info"
          className="mb-5 flex flex-row items-center gap-2 p-5 text-[14px]"
        >
          <SvgIcon
            fillColor="info"
            className={"[&>svg]:h-[20px] [&>svg]:w-[20px]"}
          >
            <IcAlertCircle />
          </SvgIcon>
          {modalData.appointmentDescription?.length ? (
            <span
              dangerouslySetInnerHTML={{
                __html: modalData.appointmentDescription,
              }}
            />
          ) : (
            "---"
          )}
          {/* {modalData.appointmentDescription} */}
        </Card>
      )}
      <div className="flex flex-col items-center justify-between pb-12 md:flex-row">
        {hasReservedAppointment ? (
          <p className="text-[15px] text-error">
            شما قبلا نوبتی برای این درخواست ثبت کرده‌اید.{" "}
            <span className="text-common-black">
              در صورت تمایل به انتخاب نوبت جدید، ابتدا نوبت قبلی خود را لغو
              نمایید.
            </span>
          </p>
        ) : (
          <p className="text-[15px]">
            پس از انتخاب نوبت موردنظر خود، دکمه ثبت نوبت را کلیک کنید.
          </p>
        )}
        <div className="flex flex-row gap-3">
          {hasReservedAppointment && (
            <Button
              variant="outline"
              color="primary"
              disabled={!selectedEventId?.length && !hasReservedAppointment}
              onClick={() => {
                if (modalData?.mode !== "edit") {
                  router.query.exp = modalData?.experimentId?.toString();
                  router.query.appt = "on";
                  router.query.step = "2";
                  router.push(router);
                }
                hideModal();
              }}
            >
              ادامه با نوبت قبلی
            </Button>
          )}
          <Button
            variant="solid"
            color="primary"
            startIcon={
              <SvgIcon
                strokeColor="white"
                className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
              >
                <IcCheck />
              </SvgIcon>
            }
            disabled={
              !selectedEventId?.length || hasReservedAppointment || isSubmitting
            }
            onClick={() => {
              requestId
                ? submitAppointment(requestId ?? -1)
                : submitchildRequest();
            }}
          >
            ثبت نوبت
          </Button>
        </div>
      </div>
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={faLocale}
          direction="rtl"
          selectable={false}
          editable={false}
          contentHeight="auto"
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="18:00:00"
          datesSet={handleDatesSet}
          events={formattedEvents?.map((event) => ({
            ...event,
            className:
              selectedEvent?.id === event.id &&
              selectedEvent?.date === format(event.start, "yyyy-MM-dd")
                ? "selected-turn"
                : event.extendedProps.className,
          }))}
          eventClick={handleEventClick}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "امروز",
            month: "ماه",
            week: "هفته",
            day: "روز",
            list: "لیست",
          }}
          firstDay={6}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          dateClick={(info) => {
            calendarRef.current?.getApi().changeView("timeGridWeek", info.date);
          }}
        />
      </div>
      <div className="flex flex-col flex-wrap gap-4 pt-9 text-[14px] md:flex-row md:gap-[36px]">
        <div className="flex flex-row items-center gap-2">
          <span className="selected-turn h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت انتخابی شما</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="h-[18px] w-[18px] rounded-[4px] bg-info bg-opacity-90"></span>
          <span>نوبت آزاد</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="reserved-active h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت رزرو شده</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="pending-active h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت در انتظار پیش پرداخت</span>
        </div>
        {/* <div className="flex flex-row items-center gap-2">
          <span className="canceled-active h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت کنسل شده</span>
        </div> */}
        <div className="flex flex-row items-center gap-2">
          <span className="free-suspended h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت آزاد تعلیق شده</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="reserved-suspended h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت رزرو تعلیق شده</span>
        </div>
        {/* <div className="flex flex-row items-center gap-2">
          <span className="canceled-suspended h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت کنسلی تعلیق شده</span>
        </div> */}
        <div className="flex flex-row items-center gap-2">
          <span className="pending-suspended h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت در انتظار پیش پرداخت تعلیق شده</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="free-inactive h-[18px] w-[18px] rounded-[4px]"></span>
          <span>نوبت غیرفعال</span>
        </div>
      </div>
    </Card>
  );
};
export default SelectAppointment;
