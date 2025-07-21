import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import { apiAppointment } from "@api/service/appointment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AppointmentStatusType,
  QueueStatusType,
} from "@api/service/appointment/type";

import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import faLocale from "@fullcalendar/core/locales/fa";
import interactionPlugin from "@fullcalendar/interaction";
import { DateHandler } from "@utils/date-handler";
import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcDelete, IcEdit, IcSetting } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const ExperimentAppointments = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const openModal = useModalHandler((state) => state.openModal);

  // ******* full calendar *******
  // sample events of calendar
  const turnsList = useMemo(() => {
    return [
      {
        date: "2025-02-02",
        start_time: "09:00:00",
        end_time: "10:00:00",
        status: "free",
      },
      {
        date: "2025-02-02",
        start_time: "15:00:00",
        end_time: "16:00:00",
        status: "reserved",
      },
      {
        date: "2025-02-01",
        start_time: "09:00:00",
        end_time: "10:30:00",
        status: "free",
      },
    ];
  }, []);

  // Reference to calendar
  const calendarRef = useRef<FullCalendar | null>(null);

  // start date and end date of current week
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // set week date range when week is changed
  const handleDatesSet = (info: any) => {
    setDateRange({
      start: format(info.start, "yyyy-MM-dd"),
      end: format(info.end, "yyyy-MM-dd"),
    });
  };

  // get appointments
  const {
    data: appointmentsList,
    isLoading: appointmentsLoading,
    refetch: refetchAppointmentsList,
  } = useQuery({
    ...apiAppointment().getAllAvailable({
      start_date: dateRange.start,
      end_date: dateRange.end,
      experiment_id: Number((router.query.name as string)?.split("$")?.[0]),
    }),
    // enabled: false,
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
      experiment_id: Number((router.query.name as string)?.split("$")?.[0]),
    }),
    // enabled: false,
  });

  useEffect(() => {
    refetchAppointmentsList();
    refetchQueuesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  useEffect(() => {
    if (router.query.action === "update" || router.query.action === "delete") {
      refetchAppointmentsList();
      refetchQueuesList();
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
  // status class
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

    return appointmentsList?.data?.map((item, index) => ({
      id: String(index + 1),
      title:
        item.status === AppointmentStatusType.RESERVED
          ? `رزرو: ${item.reserved_by_obj?.first_name} ${item.reserved_by_obj?.last_name}`
          : item.status === AppointmentStatusType.PENDING
            ? `در انتظار پیش پرداخت: ${item.reserved_by_obj?.first_name} ${item.reserved_by_obj?.last_name}`
            : "",
      start: `${item.date}T${item.start_time}`,
      end: `${item.date}T${item.end_time}`,
      extendedProps: {
        request_id: item.request_id,
        request_number: item.request_parent_number,
        request_status: item.request_status,
        appointment_id: item.appointment_id,
        status: item.status,
        queueStatus: queuesList?.data?.find(
          (queue) => queue.id === item.queue_id,
        )?.status,
        className: getAppointmentClass(
          item.status,
          queuesList?.data?.find((queue) => queue.id === item.queue_id)
            ?.status ?? "",
        ),
        reserved_by:
          item.reserved_by_obj?.first_name +
          " " +
          item.reserved_by_obj?.last_name,
      },
    }));
  }, [appointmentsList, queuesList]);
  // Handle event click
  const handleEventClick = (info: any) => {
    const event = info.event;
    const statusClassName = event.extendedProps
      .className as keyof typeof appointmentStatus;
    const statusText = appointmentStatus[statusClassName] || "نامشخص";
    if (
      Object.keys(appointmentStatus).includes(event.extendedProps.className)
    ) {
      openModal(ModalKeys.VIEW_APPOINTMENT_INFO, {
        startTime: format(event.start, "HH:mm", { locale: faIR }),
        endTime: format(event.end, "HH:mm", { locale: faIR }),
        date: DateHandler.formatDate(event.end, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        startDateTime: event.start,
        className: event.extendedProps.className,
        status: statusText,
        reservedBy: event.extendedProps.reserved_by,
        request_number: event.extendedProps.request_number,
        request_id: event.extendedProps.request_id,
        request_status: event.extendedProps.request_status,
        appointment_id: event.extendedProps.appointment_id,
      });
    }
  };

  return (
    <>
      <div className="md:p-2">
        <h6 className="pb-6 font-bold">
          نوبت دهی آزمون {(router.query.name as string)?.split("$")?.[1]}
        </h6>
        <div className="">
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
              className: event.extendedProps.className,
            }))}
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
              calendarRef.current
                ?.getApi()
                .changeView("timeGridWeek", info.date);
            }}
            eventClick={handleEventClick}
            dayHeaderContent={(args) => {
              const isWeekOrDayView =
                args.view.type === "timeGridWeek" ||
                args.view.type === "timeGridDay";

              return (
                <div className="flex flex-col items-center gap-3 px-2 py-1">
                  <span>{args.text}</span>
                  {isWeekOrDayView && (
                    <div className="flex gap-1">
                      <Tooltip message="ویرایش نوبت‌ها">
                        <SvgIcon
                          onClick={() =>
                            openModal(ModalKeys.OPERATOR_EDIT_QUEUE, {
                              date: args.date,
                              dateRange: dateRange,
                            })
                          }
                          strokeColor={"primary"}
                          className={
                            "cursor-pointer [&_svg]:h-[20px] [&_svg]:w-[20px]"
                          }
                        >
                          <IcEdit />
                        </SvgIcon>
                      </Tooltip>
                      <Tooltip message="وضعیت نوبت‌ها">
                        <SvgIcon
                          onClick={() =>
                            openModal(ModalKeys.OPERATOR_EDIT_QUEUE_STATUS, {
                              date: args.date,
                              dateRange: dateRange,
                            })
                          }
                          fillColor={"primary"}
                          className={
                            "cursor-pointer [&_svg]:h-[16px] [&_svg]:w-[16px]"
                          }
                        >
                          <IcSetting />
                        </SvgIcon>
                      </Tooltip>
                      <Tooltip message="حذف نوبت‌ها">
                        <SvgIcon
                          onClick={() =>
                            openModal(ModalKeys.OPERATOR_DELETE_QUEUE, {
                              date: args.date,
                              dateRange: dateRange,
                            })
                          }
                          fillColor="primary"
                          className={
                            "cursor-pointer [&_svg]:h-[14px] [&_svg]:w-[14px]"
                          }
                        >
                          <IcDelete />
                        </SvgIcon>
                      </Tooltip>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
        <div className="flex flex-col flex-wrap gap-4 pt-9 text-[14px] md:flex-row md:gap-[36px]">
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
          <div className="flex flex-row items-center gap-2">
            <span className="pending-suspended h-[18px] w-[18px] rounded-[4px]"></span>
            <span>نوبت در انتظار پیش پرداخت تعلیق شده</span>
          </div>
          {/* <div className="flex flex-row items-center gap-2">
            <span className="canceled-suspended h-[18px] w-[18px] rounded-[4px]"></span>
            <span>نوبت کنسلی تعلیق شده</span>
          </div> */}
          <div className="flex flex-row items-center gap-2">
            <span className="free-inactive h-[18px] w-[18px] rounded-[4px]"></span>
            <span>نوبت غیرفعال</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperimentAppointments;
